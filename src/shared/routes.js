// Containers
import Products from '../app/views/Products';
import Login from '../app/views/Login';
import Users from '../app/views/Users';
import Blog from '../app/views/Blog/';
import Register from '../app/views/Register/';

const routes = [
  {
    path: '/',
    component: Products,
    exact: true
  },
  {
    path: '/Login',
    component: Login
  },
  {
    path: '/Users',
    component: Users
  },
  {
    path: '/Blog',
    component: Blog
  },
  {
    path: '/register',
    component: Register
  }
];

export default routes;
