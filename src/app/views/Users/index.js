// Dependencies
import React, {Component} from 'react';
import { Button, Container, Item, Grid, Segment, Image, List, Modal, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

//  API
import {getUsers} from '../../api';

//  Actions
import { fetchUsers, fetchDeleteUser } from './actions';

//  Utils
import {signOut} from '../../utils';

//  Layout
import {Layout} from '../../common-components';

//  Styles
import styles from './users.scss';

console.log('Cookies: ', document);

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  deleteUser(id) {
    const { deleteUser, history, user } = this.props;

    deleteUser(id);

    if (id === user.id) {
      signOut(() => {
        history.replace({pathname: '/login'});
        location.reload();
      });
    }
  }

  render() {
    const { users, user, products } = this.props;

    return (
      <Layout {...this.props}>
        <Container>
          <div className={styles.users}>
            <List divided verticalAlign='middle' className={styles.list}>
              {users && Array.isArray(users) && _.map(users, ({ name = '', rol = '', avatar = '', id = '' }, key = 0) => (
                <List.Item className={[styles.w100]} key={`lintellect_user:${key}:${name}`}>
                  <List.Content className={[styles.w100, styles['user-content']]}>
                    <Segment attached="top" className={[styles.w100, styles['user-item']]}>
                      <Image avatar src={avatar} size="tiny" className={styles['user-item-image']} />

                      <div className={styles['user-item-text']}>
                        <span>{`Nombre: ${name}`}</span>
                        <span>{`Permisos: ${rol}`}</span>
                      </div>

                      <Button.Group vertical className={[styles['user-item-btn-grout']]}>
                        <Button color="red" onClick={() => this.deleteUser(id)}>Borrar</Button>

                        <Modal trigger={<Button color="green">Productos</Button>}>
                          <Modal.Header>{`Productos de ${user.name}`}</Modal.Header>

                          <Modal.Content image scrolling>
                            <Modal.Description className={styles.w100}>
                              <Item.Group>
                                {products.filter(product => product.user.id === user.id).map((product, index) => (
                                  <Item key={`user-product:${index}`} className={styles.separator}>
                                    <Item.Image centered src={product.picture.url} size="small" />

                                    <Item.Content>
                                      <Item.Header>{product.name}</Item.Header>

                                      <Item.Description>{product.description}</Item.Description>
                                    </Item.Content>
                                  </Item>
                                ))}
                              </Item.Group>
                            </Modal.Description>
                          </Modal.Content>

                          <Modal.Actions>
                            <Button primary>
                                Proceed <Icon name='chevron right' />
                            </Button>
                          </Modal.Actions>
                        </Modal>
                      </Button.Group>
                    </Segment>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </div>
        </Container>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users.data,
  user: state.app.user,
  products: state.products.products
});

const mapDispatchToProps = dispatch => ({
  deleteUser: (id = '') => fetchDeleteUser(dispatch, id)
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
