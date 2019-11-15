// Dependencies
import React from 'react';
import {BrowserRouter, StaticRouter, Switch, Route} from 'react-router-dom';
import _ from 'lodash';

//  Client Store
import {store} from './client';

// Routes
import routes from '../shared/routes';

//  Actions
import {fetchUsers} from './views/Users/actions';
import {updateUser} from './app.actions';
import {fetchProducts} from './common-components/Products/actions';

export default ({ server, location, context }) => {
  const token = localStorage.getItem('TOKEN');
  const user = JSON.parse(localStorage.getItem('USER'));
  const routesMap = routes.map((route, i) => <Route key={i} {...route} />);

  // Client Router
  let router = (
    <BrowserRouter>
      <Switch>
        {routesMap}
      </Switch>
    </BrowserRouter>
  );

  // Server Router
  if (server) {
    router = (
      <StaticRouter location={location} context={context}>
        <Switch>
          {routesMap}
        </Switch>
      </StaticRouter>
    );
  }

  fetchUsers(store.dispatch);
  fetchProducts(store.dispatch);
  updateUser(store.dispatch, user);

  return (
    <div>
      {router}
    </div>
  );
};
