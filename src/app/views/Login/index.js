// Dependencies
import React, {Component} from 'react';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';
import {Container, Button, Form} from 'semantic-ui-react';
import {connect} from 'react-redux';
import _ from 'lodash';

//  Actions
import {updateUser} from '../../app.actions';

//  Components
import {Google} from './components';

// Styles
import styles from './login.scss';

class Login extends Component {
  static token = localStorage.getItem('TOKEN');
  static user = localStorage.getItem('user');

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isFetching: false,
      redirect: false,
      path: ''
    };

    this.onChangeState = this.onChangeState.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  componentWillMount() {
    if (!_.isEmpty(Login.token) && !_.isEmpty(Login.token)) {
      this.setState({redirect: true, path: ''});
    }
  }

  async onLogin() {
    const {email, password, redirect} = this.state;

    if (email && password && !redirect) {
      const formData = new FormData();

      formData.append('email', email);
      formData.append('password', password);

      await axios.post('http://localhost:3000/signin', formData)
        .then(async ({data}) => {
          const user = await JSON.stringify(data.user);
          await localStorage.setItem('TOKEN', `Bearer ${data.token}`);
          await localStorage.setItem('USER', user);

          await this.setState(state => ({
            ...state,
            isFetching: false,
            redirect: false,
            path: ''
          }));

          await location.reload();
        })
        .catch(error => console.log(error));
    } else {
      if (!email) {
        alert('Inserte un email valido');
      }

      if (!password) {
        alert('Inserte una contraseña valida');
      }
    }
  }

  onChangeState({key = '', value = ''}) {
    this.setState({[key]: value});
  }

  render() {
    const {email, path, password, redirect} = this.state;
    const {history, user} = this.props;

    const isValid = [email, password, password].every(element => !!element);

    if (redirect && _.isEmpty(user)) {
      history.replace({pathname: path === '' ? '/' : `/${path}`});
      this.setState({path: '',redirect: false});
      location.reload();
      return (
        <Redirect to={`/${path}`}/>
      );
    }

    return (
      <Container>
        <div className={styles.login}>
          <Form>
            <Form.Input
              required
              fluid
              autocomplete="Email"
              type="Email"
              label="Email"
              placeholder="Email"
              onChange={(_event_, {value}) => this.onChangeState({key: 'email', value})}
            />

            <Form.Input
              required
              fluid
              type="Password"
              label="Password"
              placeholder="Password"
              onChange={(_event_, {value}) => this.onChangeState({key: 'password', value})}
            />

            <div className={styles.center}>
              <Link to="/Register" className={styles['register-link']}>Rigistro</Link>
            </div>

            <div className={styles.submit}>
              <Button.Group>
                <Button
                  color={isValid ? 'green' : 'grey'}
                  className={styles['submit-btn']}
                  onClick={this.onLogin}
                >
                Sing In
                </Button>

                <Button.Or />

                <Google {...this.props}/>
              </Button.Group>
            </div>
          </Form>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.app.user
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
