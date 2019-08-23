// Action Types
import { FETCH_PRODUCTS, FETCH_PRODUCTS_IS_FETCHING } from './actionTypes';

const initialState = {
  products: [],
  isFetching: false
};

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS.success(): {
      return {
        ...state,
        products: action.payload
      };
    }

    case FETCH_PRODUCTS_IS_FETCHING.success(): {
      return {
        ...state,
        isFetching: action.payload
      };
    }

    default:
      return state;
  }
}
