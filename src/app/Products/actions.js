//  Dependencies
import _ from 'lodash';

// Api
import {getProducts, onDeleteProduct, onEditProduct} from './api';

// Action Types
import {FETCH_PRODUCTS, FETCH_PRODUCTS_IS_FETCHING} from './actionTypes';

export function updateProducts(dispatch) {
  dispatch({
    type: FETCH_PRODUCTS_IS_FETCHING.success(),
    payload: true
  });

  return getProducts()
    .then(products => dispatch({
      type: FETCH_PRODUCTS.success(),
      payload: products
    }))
    .then(products => dispatch({
      type: FETCH_PRODUCTS_IS_FETCHING.success(),
      payload: false
    }))
    .catch(error => {
      console.log(error);
    });
}

export function fetchProducts(dispatch) {
  return updateProducts(dispatch)
    .then(async data => await updateProducts(dispatch))
    .catch(error => {
      console.log(error);
    });
}

export function fetchUpdateProducts(dispatch, dataUpdated) {
  debugger;
  return onEditProduct({dataUpdated}).then(async data => {
    const _data_ = data;
    debugger;

    await updateProducts(dispatch);
  }).catch(error => {
    console.log(error);
  });
}

export function fetchDeleteProducts(dispatch, id) {
  debugger;
  return onDeleteProduct(id).then(async ({data}) => {
    const _data_ = data;
    debugger;
    await updateProducts(dispatch);
  }).catch(error => {
    console.log(error);
  });
}
