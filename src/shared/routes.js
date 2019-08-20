// Components
import Home from '../app/Home';
import Login from '../app/Login';
import About from '../app/About';

// Containers
import Blog from '../app/Blog';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/Login',
    component: Login,
    exact: true
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
