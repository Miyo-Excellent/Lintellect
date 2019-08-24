// Dependencies
import { createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

// Root Reducer
import rootReducer from './reducers';
import {isDevelopment} from './utils/environment';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

export default function configureStore(initialState) {
  const middleware = [];

  if (isDevelopment()) {
    middleware.push(thunk);
  }

  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );
}
