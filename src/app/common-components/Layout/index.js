//  Dependencies
import React, {Component} from 'react';
import { Redirect } from 'react-router';
import {Container} from 'semantic-ui-react';

//  Common Components
import {Bar} from '../';

//  Styles
import styles from './layout.scss';

export default class Layout extends Component {
  static token = localStorage.getItem('TOKEN');

  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      path: ''
    };
  }

  componentWillMount() {
    if (!Layout.token) {
      this.setState({redirect: true, path: 'login'});
    }
  }

  render() {
    const {children,history} = this.props;
    const {path, redirect} = this.state;

    if (redirect) {
      history.replace({pathname: path === '' ? '/' : `/${path}`});
      location.reload();
      return (
        <Redirect to={`/${path}`}/>
      );
    }

    return (
      <Container className={styles.layout}>
        <Bar pathname={this.props.location.pathname} {...this.props} />

        {children}
      </Container>
    );
  }
}
