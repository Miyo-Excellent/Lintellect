//  Dependencies
import React, {Component} from 'react';
import {Input, Menu, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
//  import _ from 'lodash';

//  Actions
import {updateUser} from "../../app.actions";

//  Styles
import styles from './bar.scss';

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: location.pathname.slice(1,),
      redirect: false,
      path: ''
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.onSingOut = this.onSingOut.bind(this);
  }

  handleItemClick(e, {name}) {
    debugger;
    if (!new RegExp(name, 'i').test(this.state.activeItem)) {
      debugger;
      this.setState({
        activeItem: name,
        path: name !== 'Products' ? name : '',
        redirect: true
      });
    }
  }

  onSingOut() {
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('USER');
    this.setState({redirect: true, path: 'login'}, async () => {
      await this.props.updateUser({});
      await location.reload();
    });
  }

  render() {
    const {activeItem, path, redirect} = this.state;
    const {history} = this.props;

    if (redirect) {
      debugger;
      history.replace({pathname: path === '' ? '/' : `/${path}`});
      return (
        <Redirect to={`/${path}`} exac/>
      );
    }

    return (
      <div>
        <Menu pointing>
          <Menu.Menu position='left'>
            <Menu.Item
              name='Products'
              active={activeItem === ''}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='Users'
              active={activeItem === 'Users'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='Blog'
              active={activeItem === 'Blog'}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>

          <Menu.Menu position='right'>
            {false && (
              <Menu.Item>
                <Input icon='search' placeholder='Search...'/>
              </Menu.Item>
            )}

            <Menu.Item>
              <Button icon='user close' content='Sing Out' onClick={this.onSingOut}/>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.app.user
});

const mapDispatchToProps = dispatch => ({
  updateUser: (user = {}) => updateUser(dispatch, user)
});

export default connect(mapStateToProps, mapDispatchToProps)(Bar);
