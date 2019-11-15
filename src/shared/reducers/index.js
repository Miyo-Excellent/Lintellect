// Dependencies
import { combineReducers } from 'redux';

// Containers Reducers
import blog from '../../app/views/Blog/reducer';
import users from '../../app/views/Users/reducer';
import app from '../../app/app.reducer';
import products from '../../app/common-components/Products/reducer';

// Shared Reducers
import device from './deviceReducer';

const rootReducer = combineReducers({
  blog,
  device,
  products,
  app,
  users
});

export default rootReducer;
