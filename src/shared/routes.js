// Containers
import Home from '../app/Home';
import Login from '../app/Login';
import About from '../app/About';
import Blog from '../app/Blog/';


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
