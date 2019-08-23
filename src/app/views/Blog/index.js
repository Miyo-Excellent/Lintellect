// Dependencices
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container} from 'semantic-ui-react';

// Common Components
import {Layout} from '../../common-components';

// Components
import Posts from './components/Posts';

// Action
import {fetchPosts} from './actions';

// Utils
import {isFirstRender} from '../../../shared/utils/data';

const mapStateToProps = ({blog}) => ({
  posts: blog.posts
});

const mapDispatchToProps = dispatch => ({});

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
      <Layout {...this.props}>
        <Container>
          <Posts posts={posts}/>
        </Container>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
