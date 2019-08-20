// Dependencies
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Container, Button} from 'semantic-ui-react';

// Styles
import styles from './Login.scss';

class Login extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
  }

  render() {
    return (
      <div className={styles.login}>
        <Link className="navbar-brand logo" to="/">Lintellect</Link>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>

        <Button>Click Here</Button>
      </div>
    );
  }
}

export default Login;
