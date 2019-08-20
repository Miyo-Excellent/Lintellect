// Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Styles
import styles from './Home.scss';

class Index extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
  }

  render() {
    return (
      <div className={styles.home}>
        Home - <Link to="/about">About</Link> - <Link to="/blog">Blog</Link> - <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default Index;
