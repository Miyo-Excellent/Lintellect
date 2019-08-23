//  Dependencies
import fs from 'fs';
import multiparty from 'multiparty';

//  Services
import {firebase} from '../services';
//  Models
import {Product} from '../models';

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

    res.status(200).send({product});
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

  console.log('POST: /api/product');
  form.parse(req, function (err, {name, price, category, description}, files) {
    const bucketNameExt = `${files.picture[0].headers['content-type']}`.split('/')[1];
    const patName = 'images';
    const bucketName = name[0].split(' ').join('_');
    const bucketFullName = `${name[0].split(' ').join('_')}.${bucketNameExt}`;

    const bucket = firebase.storage.bucket(patName);
    debugger;
    const file = bucket.file(bucketFullName);
    const buffer = fs.createWriteStream();
  debugger;
    file.save(files.picture[0], error => {
      debugger;
      if (error) {
        debugger;
        console.log(error);
      }
    });
    debugger;

    const product = new Product();

    debugger;
    product.name = name[0];
    product.picture = `https://storage.googleapis.com/${patName}/${bucketFullName}`;
    product.price = price[0];
    product.category = category[0];
    product.description = description[0];
    debugger;

    product.save(function (error, productStored) {
      debugger;
      if (error) {
        debugger;
        return res.status(500).send({message: `Error al guardar producto en la base de datos ${error}`});
      }

      debugger;
      if (!productStored) {
        debugger;
        return res.status(404).send({message: 'El producto no existe'});
      }

      debugger;
      res.status(200).send({product: productStored});
    });
  }).catch(error => console.log(error));
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
