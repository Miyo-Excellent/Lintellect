// Dependencies
import React, {Component} from 'react';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';
import {Container, Button, Form} from 'semantic-ui-react';

//  Components

// Styles
import styles from './login.scss';

export default class Register extends Component {
  static token = localStorage.getItem('TOKEN');

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      acceptTerms: false,
      isFetching: false,
      redirect: false,
      path: ''
    };

    this.onChangeState = this.onChangeState.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  componentWillMount() {
    if (Register.token) {
      this.setState({redirect: true, path: ''});
    }
  }

  onSignUp() {
    const formData = new FormData();
    const {email, password, name} = this.state;

    if (email && password && name) {
      formData.append('email', email);
      formData.append('name', name);
      formData.append('password', password);

      axios.post('http://localhost:3000/signup', formData)
        .then(({data}) => {
          localStorage.setItem('TOKEN', `Bearer ${data.token}`);

          this.setState(state => ({
            ...state,
            isFetching: false,
            redirect: true,
            path: ''
          }));

        })
        .catch(error => {
          console.log(error.response.data.message);

          if (/duplicate/i.test(error.response.data.message)) {
            alert('El usuario ya existe, debe utilizar otro "Email"');
          }
        });
    } else {
      if (!email) {
        alert('Inserte un email valido');
      }
      if (!password) {
        alert('Inserte una contraseña valida');
      }
      if (!name) {
        alert('Inserte un nombre valido');
      }
    }
  }

  onChangeState({key = '', value = ''}) {
    this.setState({[key]: value});
  }

  render() {
    const {acceptTerms, email, path, password, redirect} = this.state;
    const {history} = this.props;

    const isValid = [acceptTerms, email, password, password].every(element => !!element);

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
              label='Name'
              placeholder='Name'
              onChange={(_event_, {value}) => this.onChangeState({key: 'name', value})}
            />

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

            <Form.Checkbox
              required
              checked={acceptTerms}
              label='I agree to the Terms and Conditions'
              error={!acceptTerms}
              onChange={(_event_, data) => this.onChangeState({key: 'acceptTerms', value: !acceptTerms})}
            />

            <div className={styles.submit}>
              <Button.Group>
                <Button
                  color="linkedin"
                  className={styles['submit-btn']}
                  onClick={() => this.setState({path: 'login', redirect: true})}
                >
                Sing In
                </Button>

                <Button.Or />

                <Button
                  color={isValid ? 'green' : 'red'}
                  className={styles['submit-btn']}
                  onClick={this.onSignUp}
                >
                  Sing up
                </Button>
              </Button.Group>
            </div>
          </Form>
        </div>
      </Container>
    );
  }
}
