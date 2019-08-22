//  Dependencies
import React, {Component} from 'react';
import {Card, Image, Button, Form} from 'semantic-ui-react';
import {connect} from 'react-redux';

//  Actions
import {fetchDeleteProducts, fetchUpdateProducts} from '../../Products/actions';

//  Styles
import styles from './product.scss';

class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      dataUpdated: {
        category: '',
        description: '',
        name: '',
        picture: '',
        price: ''
      }
    };

    this.handleChangeDataUpdated = this.handleChangeDataUpdated.bind(this);
  }

  componentWillMount() {
    const {category = '', description = '', name = '', picture = '', price = ''} = this.props.data;

    this.setState(state => ({
      ...state,
      dataUpdated: {
        ...state.dataUpdated,
        category,
        description,
        name,
        picture,
        price
      }
    }));
  }

  handleChangeDataUpdated({key = '', value}) {
    this.setState(state => ({
      ...state,
      dataUpdated: {
        ...state.dataUpdated,
        [key]: value
      }
    }));
  }

  render() {
    const {data, deleteProduct, updateProduct} = this.props;
    const {editing, dataUpdated} = this.state;

    return (
      <Card>
        {!editing && <Image src={data.picture} alt={data.name} wrapped ui={false}/>}

        {editing && (
          <Card.Content>
            <Card.Header>{`Editando Producto ${data.name}`}</Card.Header>

            <Form>
              <div>
                <Form.Input
                  fluid
                  label='Nombre'
                  placeholder={dataUpdated ? dataUpdated.name : 'Nombre'}
                  onChange={(_event_, {value}) => this.handleChangeDataUpdated({key: 'name', value})}
                />

                <Form.Input
                  fluid
                  type="file"
                  label='Imagen'
                  placeholder={dataUpdated ? dataUpdated.picture : 'Imagen'}
                  onChange={(_event_, data) => {
                    const file = _event_.target.files[0];

                    this.handleChangeDataUpdated({key: 'picture', value: file});
                  }}
                />

                <Form.Input
                  fluid
                  label='Precio'
                  placeholder={dataUpdated ? dataUpdated.price : 'Precio'}
                  onChange={(_event_, {value}) => this.handleChangeDataUpdated({key: 'price', value})}
                />

                <Form.TextArea
                  label='Descripción'
                  placeholder={dataUpdated ? dataUpdated.price : 'Tell us more about product...'}
                  onChange={(_event_, {value}) => this.handleChangeDataUpdated({key: 'description', value})}
                />
              </div>

              <div className={[styles.center, styles.mv5, styles.w100]}>
                <Form.Group inline>
                  <label>Categoria</label>
                  <div>
                    <Form.Radio
                      label='Computers'
                      value='computers'
                      checked={dataUpdated.category === 'computers'}
                      onChange={() => this.handleChangeDataUpdated({key: 'category', value: 'computers'})}
                    />
                    <Form.Radio
                      label='Phones'
                      value='phones'
                      checked={dataUpdated.category === 'phones'}
                      onChange={() => this.handleChangeDataUpdated({key: 'category', value: 'phones'})}
                    />
                    <Form.Radio
                      label='Accesories'
                      value='accesories'
                      checked={dataUpdated.category === 'accesories'}
                      onChange={() => this.handleChangeDataUpdated({key: 'category', value: 'accesories'})}
                    />
                  </div>
                </Form.Group>
              </div>

              <Form.Group>
                <div className={styles.center}>
                  <Button.Group>
                    <Button
                      positive
                      className={styles['submit-btn']}
                      onClick={() => updateProduct({id: data._id, dataUpdated})}
                    >Guardar</Button>

                    <Button.Or text="O"/>

                    <Button
                      negative
                      className={styles['submit-btn']}
                      onClick={() => this.setState({editing: false})}
                    >Cancelar</Button>
                  </Button.Group>
                </div>
              </Form.Group>
            </Form>
          </Card.Content>
        )}

        {!editing && (
          <Card.Content>
            <Card.Header>{data.name}</Card.Header>

            <Card.Meta>
              <span className='date'>Joined in 2015</span>
            </Card.Meta>

            <Card.Description>{data.description}</Card.Description>
          </Card.Content>
        )}

        {!editing && (
          <Card.Content extra>
            <div className={styles.footer}>
              <Button.Group size='large'>
                <Button
                  circular
                  icon='pencil alternate'
                  onClick={() => {
                    this.setState({editing: true});
                  }}
                />
                <Button
                  circular
                  icon='cancel'
                  onClick={() => deleteProduct(data._id)}
                />
              </Button.Group>
            </div>
          </Card.Content>
        )}
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  products: state.products.products
});

const mapDispatchToProps = dispatch => ({
  updateProduct: ({id, dataUpdated}) => fetchUpdateProducts(dispatch, id, dataUpdated),
  deleteProduct: id => fetchDeleteProducts(dispatch, id)
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
