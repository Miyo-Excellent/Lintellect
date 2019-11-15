//  Dependencies
import _ from 'lodash';

// Api
import {} from './api';

// Action Types
import {FETCH_USER, FETCH_USER_IS_FETCHING} from './app.actionTypes';

export function updateUser(dispatch, user) {
  return Promise.resolve().then(() => {
    dispatch({
      type: FETCH_USER_IS_FETCHING.success(),
      payload: true
    });
  }).then(() => {
    dispatch({
      type: FETCH_USER.success(),
      payload: user
    });
  }).then(() => {
    dispatch({
      type: FETCH_USER_IS_FETCHING.success(),
      payload: false
    });
  }).catch(error => {
    console.log(error);
  });
}
