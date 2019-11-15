// Action Types
import { FETCH_USERS, FETCH_USERS_IS_FETCHING } from './actionTypes';

const initialState = {
  data: [],
  isFetching: false
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS.success(): {
      return {
        ...state,
        data: action.payload
      };
    }

    case FETCH_USERS_IS_FETCHING.success(): {
      return {
        ...state,
        isFetching: action.payload
      };
    }

    default:
      return state;
  }
}
