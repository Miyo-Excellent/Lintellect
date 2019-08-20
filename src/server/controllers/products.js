//  Models
import {Product} from "../models";

export async function getProducts(req, res) {
  console.log('GET: /api/products');

  Product.find((error, products) => {
    if (error) return res.status(500).send({message: `Error al solicitar producto en la base de datos ${error}`});

    if (!products) return res.status(404).send({message: 'El producto no existe'});

    res.status(200).send({products});
  });
}

export async function getProduct(req, res) {
  const {productId} = await req.params;

  console.log('GET: /api/product');

  Product.findById(productId, (error, product) => {
    if (error) return res.status(500).send({message: `Error al solicitar producto en la base de datos ${error}`});

    if (!product) return res.status(404).send({message: 'El producto no existe'});

    res.status(200).send({product});
  });
}

export async function updateProducts(req, res) {
  const {productId} = await req.params;
  const update = req.query;

  Product.findByIdAndUpdate(productId, update, (error, productUpdated) => {
    if (error) return res.status(500).send({message: `Error al actualizar producto en la base de datos ${error}`});

    if (!productUpdated) return res.status(404).send({message: 'El producto no existe'});

    res.status(200).send({product: productUpdated});
  });
}

export async function saveProduct(req, res) {
  const {name, picture, price, category, description} = await req.query;

  const product = new Product();

  product.name = name;
  product.picture = picture;
  product.price = price;
  product.category = category;
  product.description = description;

  console.log('POST: /api/product');

  product.save(function (error, productStored) {
    if (error) return res.status(500).send({message: `Error al guardar producto en la base de datos ${error}`});

    if (!productStored) return res.status(404).send({message: 'El producto no existe'});

    res.status(200).send({product: productStored});
  });
}

export async function deleteProducts(req, res) {
  const {productId} = await req.params;

  console.log('GET: /api/product');

  Product.findById(productId, function (error, product) {
    if (error) return res.status(500).send({message: `Error al borrar el producto en la base de datos ${error}`});

    if (!product) return res.status(404).send({message: 'El producto no existe'});

    product.remove(error => {
      if (error) return res.status(500).send({message: `Error al guardar producto en la base de datos ${error}`});

      res.status(200).send({message: 'El producto ha sido eliminado', product});
    });
  });
}
