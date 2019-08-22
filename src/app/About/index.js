// Dependencies
import React, {Component} from 'react';
import {Layout} from '../common-components';
import {Container} from 'semantic-ui-react';

class About extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <Container className="about">
          <p>About</p>
        </Container>
      </Layout>
    );
  }
}

export default About;
