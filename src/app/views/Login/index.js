// Dependencies
import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
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
      acceptTerms: false,
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

  onLogin() {
    const {email, password} = this.state;

    axios.post('http://localhost:3000/signin', {email, password})
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
  }

  onChangeState({key = '', value = ''}) {
    this.setState({[key]: value});
  }

  render() {
    const {acceptTerms, email, path, password, redirect} = this.state;
    const {history} = this.props;

    if (redirect) {
      history.replace({pathname: path === '' ? '/' : `/${path}`});
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
                  color={!!email && !!password && !!acceptTerms ? 'green' : 'grey'}
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
