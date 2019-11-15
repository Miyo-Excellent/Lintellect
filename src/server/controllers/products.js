//  Dependencies
import fs from 'fs';
import multiparty from 'multiparty';
import cloudinary from 'cloudinary';
import _ from 'lodash';

import logger from '../logger';
import validations from '../validations';

//  Services

//  Models
import {Product} from '../models';

async function cloudinaryUploadFile({filepath, options = {}}) {
  function callback({url, public_id}) {
    logger.info(`Imagen alamacenada en Cloudinary ${result.url}`);
    console.info(`Imagen alamacenada en Cloudinary ${result.url}`);

    return { url, id: public_id };
  }

  return cloudinary.uploader.upload(filepath, options, callback, {resource_type: 'auto'});
}

async function cloudinaryDeleteFile({ids, options = {}}) {
  function callback(result) {
    logger.info(`Se ha elimiando la imagen alamacenada en Cloudinary [IDS: ${ids}]`);
    console.info(`Se ha elimiando la imagen alamacenada en Cloudinary [IDS: ${ids}]`);
  }

  return cloudinary.v2.api.delete_resources(ids, options, callback);
}

export async function getProducts(req, res) {
  logger.info(`GET:[ip:${req.ip}] /api/products`);
  console.info(`GET:[ip:${req.ip}] /api/products`);

  await Product.find(function (error, products) {
    if (error) {
      logger.error(`GET:[ip:${req.ip}] Error al solicitar producto en la base de datos ${error}`);
      console.error(`GET:[ip:${req.ip}] Error al solicitar producto en la base de datos ${error}`);

      return res.status(500).send({message: `Error al solicitar producto en la base de datos ${error}`});
    }

    if (!products) {
      logger.error(`GET:[ip:${req.ip}] El producto no existe`);
      console.error(`GET:[ip:${req.ip}] El producto no existe`);

      return res.status(404).send({message: 'El producto no existe'});
    }

    logger.info(`GET:[ip:${req.ip}] Han solicitado todos los productos`);
    console.info(`GET:[ip:${req.ip}] Han solicitado todos los productos`);

    return res.status(200).send({products});
  });
}

export async function getProduct(req, res) {
  logger.info(`GET:[ip:${req.ip}] /api/product`);
  console.info(`GET:[ip:${req.ip}] /api/product`);

  const productId = req.params.productId || req.body.productId || req.query.productId;

  await Product.findById(productId, function (error, product) {
    if (error) {
      logger.error(`GET:[ip:${req.ip}] Error al solicitar producto en la base de datos ${error}`);
      console.error(`GET:[ip:${req.ip}] Error al solicitar producto en la base de datos ${error}`);

      return res.status(500).send({message: `Error al solicitar producto en la base de datos ${error}`});
    }

    if (!product) {
      logger.error(`GET:[ip:${req.ip}] El producto [ID: ${productId}] no existe`);
      console.error(`GET:[ip:${req.ip}] El producto [ID: ${productId}] no existe`);

      return res.status(404).send({message: 'El producto no existe'});
    }

    logger.info(`GET:[ip:${req.ip}] Han solicitado el producto [ID: ${productId}]`);
    console.info(`GET:[ip:${req.ip}] Han solicitado el producto [ID: ${productId}]`);

    return res.status(200).send({product});
  });
}

export async function updateProducts(req, res) {
  logger.info(`PUT:[ip:${req.ip}] /api/product`);
  console.info(`PUT:[ip:${req.ip}] /api/product`);

  const productId = req.params.productId || req.body.productId || req.query.productId;
  const form = new multiparty.Form();

  function success(error, productUpdated) {
    if (error) {
      logger.error(`PUT:[ip:${req.ip}] Error al actualizar el producto [ID: ${productId}]`);
      console.error(`PUT:[ip:${req.ip}] Error al actualizar el producto [ID: ${productId}]`);

      return res.status(500).send({message: `Error al actualizar producto en la base de datos ${error}`});
    }

    if (!productUpdated) {
      logger.error(`PUT:[ip:${req.ip}] El producto [ID: ${productId}] no existe`);
      console.error(`PUT:[ip:${req.ip}] El producto [ID: ${productId}] no existe`);

      return res.status(404).send({message: 'El producto no existe'});
    }

    logger.info(`PUT:[ip:${req.ip}] Han solicitado el producto [ID: ${productId}]`);
    console.info(`PUT:[ip:${req.ip}] Han solicitado el producto [ID: ${productId}]`);

    res.status(200).send({
      message: 'El producto se actualizo',
      product: productUpdated
    });
  }

  form.parse(req, async function (err, {name, price, category, description, ids}, files) {
    const uniqueFilename = new Date().toISOString();
    const patName = 'products';
    const productUpdated = {};

    if (name) {
      productUpdated.name = name[0];
    }

    if (price) {
      productUpdated.name = price[0];
    }

    if (category) {
      productUpdated.name = category[0];
    }

    if (description) {
      productUpdated.name = description[0];
    }

    if (!_.isEmpty(files) && !_.isEmpty(files.picture)) {
      const bucketName = files.picture[0].originalFilename;
      const filepath = files.picture[0].path;

      cloudinaryUploadFile({
        filepath,
        options: {
          folder: patName,
          public_id: `${patName}/${bucketName}__${uniqueFilename}`,
          tags: patName
        }
      }).then(async function ({public_id, url}) {
        productUpdated.picture = {ids: public_id, url};

        await Product.findByIdAndUpdate(productId, productUpdated, function (error, productUpdated) {

          cloudinaryDeleteFile({ids, options: {
            folder: patName,
            public_id: `${patName}/${bucketName}__${uniqueFilename}`,
            tags: patName
          }});

          success(error, productUpdated);
        });
      }).catch();
    } else {
      await Product.findByIdAndUpdate(productId, productUpdated, success);
    }
  });
}

export async function deleteProducts(req, res) {
  logger.info(`DELETE:[ip:${req.ip}] /api/product`);
  console.info(`DELETE:[ip:${req.ip}] /api/product`);

  const {productId} = await req.params;

  await Product.findById(productId, function (error, product) {
    if (error) {
      logger.error(`DELETE:[IP: ${req.ip}] Error al borrar el producto [ID: ${productId}] ${error}`);
      console.error(`DELETE:[IP: ${req.ip}] Error al borrar el producto [ID: ${productId}] ${error}`);

      return res.status(500).send({message: `Error al borrar el producto en la base de datos ${error}`});
    }

    if (!product) {
      logger.error(`DELETE:[IP: ${req.ip}] El producto [ID: ${productId}] no existe ${error}`);
      console.error(`DELETE:[IP: ${req.ip}] El producto [ID: ${productId}] no existe ${error}`);

      return res.status(404).send({message: 'El producto no existe'});
    }

    product.remove(error => {
      if (error) {
        logger.error(`DELETE:[IP: ${req.ip}] Error al guardar el producto [ID: ${productId}] en la base de datos ${error}`);
        console.error(`DELETE:[IP: ${req.ip}] Error al guardar el producto [ID: ${productId}] en la base de datos ${error}`);

        return res.status(500).send({message: `Error al guardar producto en la base de datos ${error}`});
      }

      logger.error(`DELETE:[IP: ${req.ip}] El producto ha sido [ID: ${productId}] eliminado`);
      console.error(`DELETE:[IP: ${req.ip}] El producto ha sido [ID: ${productId}] eliminado`);

      res.status(200).send({message: 'El producto ha sido eliminado', product});
    });
  });
}

export async function saveProduct(req, res, next) {
  logger.info(`POST:[ip:${req.ip}] /api/product`);
  console.info(`POST:[ip:${req.ip}] /api/product`);

  debugger;

  const form = new multiparty.Form();

  const storingProduct = (filepath, {name, picture, price, category, description = '', user}) => {
    const product = new Product({user, name, picture, price, category, description});

    product.save(function (error, productStored) {
      if (error) {
        logger.error(`POST:[IP: ${req.ip}] Error al guardar producto en la base de datos ${error}`);
        console.error(`POST:[IP: ${req.ip}] Error al guardar producto en la base de datos ${error}`);

        return res.status(500).send({message: `Error al guardar producto en la base de datos ${error}`});
      }

      if (!productStored) {
        logger.error(`POST:[IP: ${req.ip}] El producto no existe ${error}`);
        console.error(`POST:[IP: ${req.ip}] El producto no existe ${error}`);

        return res.status(404).send({message: 'El producto no existe'});
      }

      fs.unlinkSync(filepath);

      logger.info(`POST:[IP: ${req.ip}] El producto se almaceno correctamente ${productStored}`);
      console.info(`POST:[IP: ${req.ip}] El producto se almaceno correctamente ${productStored}`);

      return res.status(200).json({message: 'El producto se almaceno correctamente', product: productStored});
    });
  };

  form.parse(req, async function (err, {name, price, category, description = ['test'], user}, files) {
    debugger;
    const uniqueFilename = new Date().toISOString();
    const patName = 'products';
    const bucketName = name[0].split(' ').join('_');
    const filepath = !_.isEmpty(files) ? files.picture[0].path : '';

    const {error, value} = validations({
      key: 'add_product',
      options: {
        name: name[0],
        category: category[0],
        description: description[0],
        price: price[0]
      }
    });

    if (error) {
      logger.info(`ERROR :: POST:[ip:${req.ip}] /api/product ${error}`);
      console.info(`ERROR :: POST:[ip:${req.ip}] /api/product`, error);

      res.status(500).send({message: error});
      return next();
    }

    if (filepath) {
      cloudinaryUploadFile({
        filepath,
        options: {
          folder: patName,
          public_id: `${patName}/${bucketName}__${uniqueFilename}`,
          tags: patName
        }
      })
      //  .uploads(filepath)
        .then(async function ({public_id, url}) {
          const options = {
            user: req.session.user,
            name: name ? name[0] : '',
            picture: {
              ids: public_id ? public_id : '',
              url: url ? url : ''
            },
            price: price ? price[0] : '',
            category: category ? category[0] : '',
            description: description ? description[0] : ''
          };

          debugger;

          return storingProduct(filepath, options);
        });
    } else {
      return storingProduct(filepath, {name: name[0],
        user: JSON.parse(user),
        picture: '',
        price: price[0],
        category: category[0],
        description: description[0]});
    }
  });
}
