// Dependencies
import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import firebase from 'firebase';

//  Configurations
import * as config from './config';

// Redux Store
import configureStore from '../shared/configureStore';

// Containers
import App from './App';

//  Firebase Initialization
firebase.initializeApp(config.firebase);

// Configuring Redux Store
const store = configureStore(window.initialState);

// DOM
const rootElement = document.getElementById('root');

// App Wrapper
const renderApp = Component => {
  render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    rootElement
  );
};

// Rendering app
renderApp(App);

// HMR
if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp(require('./App').default);
  });
}
