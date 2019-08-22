import axios from 'axios';

const token = localStorage.getItem('TOKEN');

export async function getProducts() {
  return await axios.get('http://localhost:3000/api/products', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      authorization: token
    }
  })
    .then(({data}) => data.products)
    .catch(error => console.log(error));
}

export async function onDeleteProduct(id) {
  const _id_ = id;
  debugger;
  return await axios.delete(`http://localhost:3000/api/product/${id}`, {headers: {authorization: token}})
    .then((data) => data)
    .catch(error => console.error(error));
}

export async function onEditProduct({id, dataUpdated}) {
  const _id_ = id;
  debugger;
  return await axios.put(`http://localhost:3000/api/product/${id}`, {
    headers: {authorization: token},
    body: dataUpdated
  })
    .then((data) => data)
    .catch(error => console.error(error));
}
