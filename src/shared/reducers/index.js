// Dependencies
import { combineReducers } from 'redux';

// Containers Reducers
import blog from '../../app/Blog/reducer';
import products from '../../app/Products/reducer';

// Shared Reducers
import device from './deviceReducer';

const rootReducer = combineReducers({
  blog,
  device,
  products
});

export default rootReducer;
