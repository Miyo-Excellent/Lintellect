//  Dependencies
import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Container, Image} from 'semantic-ui-react';
import {connect} from 'react-redux';
import _ from 'lodash';

//  Actions
import {fetchProducts} from "../Products/actions";
import {updateUser} from '../../app.actions';

//  Common Components
import {Bar} from '../';

//  Assets
import logo from '../../assets/images/logos/lintellect.svg';

//  Styles
import styles from './layout.scss';

class Layout extends Component {
  static token = localStorage.getItem('TOKEN');
  static user = localStorage.getItem('USER');

  constructor(props) {
    super(props);

    this.state = {
      path: '',
      redirect: false
    };
  }

  async componentWillMount() {
    const token = Layout.token;
    const user = Layout.user ? JSON.parse(Layout.user) : null;

    console.log('USER: ', user);
    console.log('TOKEN: ', token);

    if (_.isEmpty(token) || _.isEmpty(user) || _.isEmpty(this.props.user)) {
      await this.setState({redirect: true, path: 'login'});
    }

    await this.props.updateUser(JSON.parse(Layout.user));
    await this.props.updateProducts();
  }

  goTo = (path = '') => {
    const {history} = this.props;
    history.replace({pathname: path === '' ? '/' : `/${path}`});

    this.setState({path: ''});

    location.reload();

    return (
      <Redirect to={`/${path}`}/>
    );
  };

  render() {
    const {children, user} = this.props;
    const {path, redirect} = this.state;

    if (path || redirect || _.isEmpty(user)) {
      //  this.goTo(path);
    }

    return (
      <Container className={[styles.layout]}>
        <div className={styles.logo}>
          <Image src={logo} className={styles['logo-img']}/>
        </div>

        <Bar pathname={this.props.location.pathname} {...this.props} />

        {children}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.app.user
});

const mapDispatchToProps = dispatch => ({
  updateUser: (user = {}) => updateUser(dispatch, user),
  updateProducts: (options = {}) => fetchProducts(dispatch, options)
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

