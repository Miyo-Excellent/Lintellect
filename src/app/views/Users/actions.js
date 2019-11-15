//  Dependencies
import _ from 'lodash';

// Api
import {getUsers, onDeleteUser} from '../../api';

// Action Types
import {FETCH_USERS, FETCH_USERS_IS_FETCHING} from './actionTypes';

export function updateUsers(dispatch) {
  dispatch({
    type: FETCH_USERS_IS_FETCHING.success(),
    payload: true
  });

  return getUsers()
    .then(users => dispatch({
      type: FETCH_USERS.success(),
      payload: users
    }))
    .then(users => dispatch({
      type: FETCH_USERS_IS_FETCHING.success(),
      payload: false
    }))
    .catch(error => {
      console.log(error);
    });
}

export function fetchUsers(dispatch) {
  return updateUsers(dispatch)
    .then(async data => await updateUsers(dispatch))
    .catch(error => {
      console.log(error);
    });
}

export function fetchDeleteUser(dispatch, id) {
  return onDeleteUser(id)
    .then(async ({data}) => await updateUsers(dispatch))
    .catch(error => console.log(error));
}

