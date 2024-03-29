//  Dependencies
import axios from 'axios';

const token = localStorage.getItem('TOKEN');

export async function getUsers() {
  return await axios.get('http://localhost:3000/api/users', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      authorization: token
    }
  })
    .then(({data}) => data.users)
    .catch(error => console.log(error));
}

export async function onDeleteUser(id) {
  return await axios.delete(`http://localhost:3000/api/user/${id}`, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      authorization: token
    }
  })
    .then((data) => data)
    .catch(error => console.error(error));
}

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

export async function onCreateNewProduct(data) {
  return await axios.post('http://localhost:3000/api/product', data, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      authorization: token
    }
  })
    .then((data) => data)
    .catch(error => {
      console.error(error);
    });
}

export async function onDeleteProduct(id) {
  return await axios.delete(`http://localhost:3000/api/product/${id}`, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      authorization: token
    }
  })
    .then((data) => data)
    .catch(error => console.error(error));
}

export async function onEditProduct({id, dataUpdated}) {
  return await axios.put(`http://localhost:3000/api/product/${id}`, dataUpdated, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      authorization: token
    }
  })
    .then((data) => data)
    .catch(error => console.error(error));
}
