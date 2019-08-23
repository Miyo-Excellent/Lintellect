// Dependencies
import { combineReducers } from 'redux';

// Containers Reducers
import blog from '../../app/views/Blog/reducer';
import products from '../../app/common-components/Products/reducer';

// Shared Reducers
import device from './deviceReducer';

const rootReducer = combineReducers({
  blog,
  device,
  products
});

export default rootReducer;
