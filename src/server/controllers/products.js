//  Dependencies
import fs from 'fs';
import multiparty from 'multiparty';
import cloudinary from 'cloudinary';
import _ from 'lodash';

//  Services

//  Models
import {Product} from '../models';

async function cloudinaryUploadFile({filepath, options = {}}) {
  function callback(result) {
    resolve({url: result.url, id: result.public_id});
  }

  return cloudinary.uploader.upload(filepath, options, callback, {resource_type: 'auto'});
}

export async function getProducts(req, res) {
  console.log('GET: /api/products');

  await Product.find(function (error, products) {
    if (error) {
      return res.status(500).send({message: `Error al solicitar producto en la base de datos ${error}`});
    }

    if (!products) {
      return res.status(404).send({message: 'El producto no existe'});
    }

    res.status(200).send({products});
  });
}

export async function getProduct(req, res) {
  const productId = req.params.productId || req.body.productId || req.query.productId;

  console.log('GET: /api/product');

  await Product.findById(productId, function (error, product) {
    if (error) {
      return res.status(500).send({message: `Error al solicitar producto en la base de datos ${error}`});
    }

    if (!product) {
      return res.status(404).send({message: 'El producto no existe'});
    }

    return res.status(200).send({product});
  });
}

export async function updateProducts(req, res) {
  const productId = req.params.productId || req.body.productId || req.query.productId;
  const update = req.body || req.query;

  await Product.findByIdAndUpdate(productId, update, function (error, productUpdated) {
    if (error) {
      return res.status(500).send({message: `Error al actualizar producto en la base de datos ${error}`});
    }

    if (!productUpdated) {
      return res.status(404).send({message: 'El producto no existe'});
    }

    res.status(200).send({
      message: 'El producto se actualizo',
      product: productUpdated
    });
  });
}

export async function saveProduct(req, res) {
  const form = new multiparty.Form();
  const storingProduct = (filepath, {name, picture, price, category, description}) => {
    const product = new Product({name, picture, price, category, description});


    debugger;

    product.save(function (error, productStored) {
      if (error) {
        return res.status(500).send({message: `Error al guardar producto en la base de datos ${error}`});
      }

      if (!productStored) {
        return res.status(404).send({message: 'El producto no existe'});
      }

      fs.unlinkSync(filepath);

      return res.status(200).json({message: 'el Producto se almaceno correctamente', product: productStored});
    });
  };

  console.log('POST: /api/product');

  form.parse(req, async function (err, {name, price, category, description}, files) {
    const uniqueFilename = new Date().toISOString();
    const patName = 'products';
    const bucketName = name[0].split(' ').join('_');
    const filepath = !_.isEmpty(files) ? files.picture[0].path : '';

    if (filepath) {
      cloudinaryUploadFile({
        filepath,
        options: {
          folder: patName,
          public_id: `${patName}/${bucketName}__${uniqueFilename}`,
          tags: patName,
          eager: [
            { width: 400, height: 300, crop: "pad" },
            { width: 260, height: 200, crop: "crop", gravity: "north"} ]
        }
      })
      //  .uploads(filepath)
        .then(async function ({url}) {
          return storingProduct(filepath, {
            name: name[0],
            picture: url,
            price: price[0],
            category: category[0],
            description: description[0]
          });
        });
    } else {
      return storingProduct(filepath, {name: name[0],
        picture: '',
        price: price[0],
        category: category[0],
        description: description[0]});
    }
  });
}

export async function deleteProducts(req, res) {
  const {productId} = await req.params;

  console.log('GET: /api/product');

  await Product.findById(productId, function (error, product) {
    if (error) {
      return res.status(500).send({message: `Error al borrar el producto en la base de datos ${error}`});
    }

    if (!product) {
      return res.status(404).send({message: 'El producto no existe'});
    }

    product.remove(error => {
      if (error) {
        return res.status(500).send({message: `Error al guardar producto en la base de datos ${error}`});
      }

      res.status(200).send({message: 'El producto ha sido eliminado', product});
    });
  });
}
