// Dependencies
import { combineReducers } from 'redux';

// Containers Reducers
import blog from '../../app/Blog/reducer';

// Shared Reducers
import device from './deviceReducer';

const rootReducer = combineReducers({
  blog,
  device
});

export default rootReducer;
