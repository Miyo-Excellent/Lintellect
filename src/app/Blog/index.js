// Dependencices
import React, {Component} from 'react';
import {connect} from 'react-redux';

// Components
import Posts from './components/Posts';

// Action
import {fetchPosts} from './actions';

// Utils
import {isFirstRender} from '../../shared/utils/data';
import {Link} from "react-router-dom";

class Blog extends Component {
  static initialAction(fetchFrom) {
    return fetchPosts(fetchFrom);
  }

  componentDidMount() {
    if (isFirstRender(this.props.posts)) {
      this.props.dispatch(Blog.initialAction('client'));
    }
  }

  render() {
    const {posts} = this.props;

    return (
      <div>
        Blog - <Link to="/about">About</Link> - <Link to="/">Home</Link> - <Link to="/login">Login</Link>
        <Posts posts={posts}/>
      </div>
    );
  }
}

export default connect(({blog}) => ({
  posts: blog.posts
}), null)(Blog);
