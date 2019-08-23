//  Dependencies
import React, {Component} from 'react';
import {Icon, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import firebase from 'firebase';

//  Styles
import styles from './google.scss';
import axios from 'axios';

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = dispatch => ({});

class Google extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleAuth = this.handleAuth.bind(this);
  }

  reload() {
    const {history} = this.props;

    history.push({pathname: '/'});
    window.location.reload();
  }

  async handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const _this_ = this;

    await firebase
      .auth()
      .signInWithPopup(await provider)
      .then(async ({credential, user}) => {
        const {email, displayName} = user;

        console.log('USER: ', user);

        await axios.post('http://localhost:3000/signin-with-google', {email, name: displayName})
          .then(({data}) => {
            localStorage.setItem('TOKEN', `Bearer ${data.token}`);
            localStorage.setItem('FIREBASE_TOKEN', `Bearer ${credential.accessToken}`);
            _this_.reload();
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className={styles.center}>
        <Button color='google plus' onClick={this.handleAuth}>
          <Icon name='google'/> Google
        </Button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Google);
