// Containers
import Home from '../app/views/Home';
import Login from '../app/views/Login';
import About from '../app/views/About';
import Blog from '../app/views/Blog/';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/Login',
    component: Login
  },
  {
    path: '/About',
    component: About
  },
  {
    path: '/Blog',
    component: Blog
  }
];

export default routes;
