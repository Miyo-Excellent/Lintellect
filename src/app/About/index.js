// Dependencies
import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Index extends Component {
  render() {
    return (
      <div className="about">
        About - <Link to="/blog">Blog</Link> - <Link to="/">Home</Link> - <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default Index;
