// Dependencies
import React, {Component} from 'react';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';
import {Container, Button, Form} from 'semantic-ui-react';

//  Components
import {Google} from './components';

// Styles
import styles from './login.scss';

class Login extends Component {
  static token = localStorage.getItem('TOKEN');

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
    if (Login.token) {
      this.setState({redirect: true, path: ''});
    }
  }

  async onLogin() {
    const formData = new FormData();
    const {email, password} = this.state;

    if (email && password) {
      formData.append('email', email);
      formData.append('password', password);

      await axios.post('http://localhost:3000/signin', formData)
        .then(({data}) => {
          localStorage.setItem('TOKEN', `Bearer ${data.token}`);

          this.setState(state => ({
            ...state,
            isFetching: false,
            redirect: true,
            path: ''
          }));

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
    const {history} = this.props;

    const isValid = [email, password, password].every(element => !!element);

    if (redirect) {
      history.replace({pathname: path === '' ? '/' : `/${path}`});
      //  location.reload();
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
              label='Email'
              placeholder='Email'
              onChange={(_event_, {value}) => this.onChangeState({key: 'email', value})}
            />

            <Form.Input
              required
              fluid
              label='Password'
              placeholder='Password'
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

export default Login;
