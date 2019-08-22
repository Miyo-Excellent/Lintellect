import React, {Component} from 'react';
import {Input, Menu, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import _ from 'lodash';

//  Styles
import styles from './menu.scss';
import {Redirect} from 'react-router-dom';

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = dispatch => ({});

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: props.pathname.slice(1,),
      redirect: false,
      path: ''
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.onSingOut = this.onSingOut.bind(this);
  }

  handleItemClick(e, {name}) {
    this.setState({
      activeItem: name !== 'Home' ? name : '',
      path: name !== 'Home' ? name : '',
      redirect: true
    });
  }

  onSingOut() {
    localStorage.removeItem('TOKEN');
    this.setState({redirect: true, path: 'login'});
  }

  render() {
    const {activeItem, path, redirect} = this.state;
    const {history} = this.props;

    if (redirect) {
      history.replace({pathname: path === '' ? '/' : `/${path}`});
      location.reload();
      return (
        <Redirect to={`/${path}`} exac/>
      );
    }

    return (
      <div>
        <Menu pointing>
          <Menu.Item
            name='Home'
            active={activeItem === ''}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='About'
            active={activeItem === 'About'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='Blog'
            active={activeItem === 'Blog'}
            onClick={this.handleItemClick}
          />
          <Menu.Menu position='right'>
            <Menu.Item>
              <Input icon='search' placeholder='Search...'/>
            </Menu.Item>

            <Menu.Item>
              <Button icon='user close' content='Sing Out' onClick={this.onSingOut}/>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar);
