// Action Types
import { FETCH_USER, FETCH_USER_IS_FETCHING } from './app.actionTypes';

const initialState = {
  user: {},
  isFetching: false
};

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER.success(): {
      return {
        ...state,
        user: action.payload
      };
    }

    case FETCH_USER_IS_FETCHING.success(): {
      return {
        ...state,
        isFetching: action.payload
      };
    }

    default:
      return state;
  }
}
