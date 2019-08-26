//  Dependencies
import React, {Component} from 'react';
import {Card, Image, Button, Form} from 'semantic-ui-react';
import {connect} from 'react-redux';

//  Actions
import {fetchDeleteProducts, fetchUpdateProducts} from '../Products/actions';

//  Styles
import styles from './product.scss';

const mapStateToProps = state => ({
  products: state.products.products
});

const mapDispatchToProps = dispatch => ({
  updateProduct: ({id, dataUpdated}) => fetchUpdateProducts(dispatch, id, dataUpdated),
  deleteProduct: id => fetchDeleteProducts(dispatch, id)
});

class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      titleExtended: false,
      descriptionExtended: false,
      editing: false,
      categories: [
        {text: 'Computadoras', value: 'computers'},
        {text: 'Telefonos', value: 'phones'},
        {text: 'accesorios', value: 'accesories'}
      ],
      dataUpdated: {
        category: '',
        description: '',
        name: '',
        picture: {
          url: '',
          ids: ''
        },
        price: ''
      }
    };

    this.handleChangeDataUpdated = this.handleChangeDataUpdated.bind(this);
  }

  componentWillMount() {
    const {category = '', description = '', name = '', picture = {}, price = ''} = this.props.data;

    //  this.setState(state => ({
    //    ...state,
    //    dataUpdated: {
    //      ...state.dataUpdated,
    //      category,
    //      description,
    //      name,
    //      picture,
    //      price
    //    }
    //  }));
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
    const {editing, dataUpdated, categories, titleExtended, descriptionExtended} = this.state;
    const {category, description, name, picture, price} = dataUpdated;

    if (
      _.isEmpty(data)
      || _.isEmpty(data.picture)
      || _.isEmpty(data.picture.url)
      || _.isEmpty(data.name)
    ) {
      return null;
    }

    return (
      <Card>
        {!editing && (
          <div className={styles['card-image-container']}>
            <Image className={styles['card-image']} src={data.picture.url} alt={data.name} ui/>
          </div>
        )}

        {editing && (
          <Card.Content>
            <Card.Header onClick={() => data.name.length > 30 ? this.setState({titleExtended: !titleExtended}) : null}>
              <p>
                {`Editando Producto ${(titleExtended || data.name.length <= 30) ? data.name : `${data.name.slice(0, 30)}`}`}
                {data.name.length > 30 && (
                  <span className={styles['show-more']}>
                    {`... ${(titleExtended || data.name.length <= 30) ? 'Menos' : 'Más'}`}
                  </span>
                )}
              </p>
            </Card.Header>

            <Form>
              <div>
                <Form.Input
                  fluid
                  label='Nombre'
                  placeholder={dataUpdated.name ? dataUpdated.name : 'Nombre'}
                  onChange={(_event_, {value}) => this.handleChangeDataUpdated({key: 'name', value})}
                />

                <Form.Input
                  fluid
                  type="file"
                  label='Imagen'
                  placeholder={dataUpdated.picture ? dataUpdated.picture : 'Imagen'}
                  onChange={(_event_, data) => {
                    const file = _event_.target.files[0];

                    this.handleChangeDataUpdated({key: 'picture', value: file});
                  }}
                />

                <Form.Input
                  fluid
                  label='Precio'
                  placeholder={dataUpdated.price ? dataUpdated.price : 'Precio'}
                  onChange={(_event_, {value}) => this.handleChangeDataUpdated({key: 'price', value})}
                />

                <Form.TextArea
                  label='Descripción'
                  placeholder={dataUpdated.description ? dataUpdated.description : 'Tell us more about product...'}
                  onChange={(_event_, {value}) => this.handleChangeDataUpdated({key: 'description', value})}
                />
              </div>

              <Form.Select
                fluid label='Categorias'
                options={categories}
                placeholder='Categorias'
                onChange={(_event_, {value}) => {
                  this.handleChangeDataUpdated({key: 'category', value});
                }}
              />

              <Form.Group>
                <div className={styles.center}>
                  <Button.Group>
                    <Button
                      positive
                      className={styles['submit-btn']}
                      onClick={() => {
                        Promise
                          .resolve()
                          .then(() => {
                            const formData = new FormData();

                            if (name) {
                              formData.append('name', name);
                            }

                            if (category) {
                              formData.append('category', category);
                            }

                            if (description) {
                              formData.append('description', description);
                            }

                            if (picture) {
                              formData.append('ids', data.picture.ids);
                              formData.append('picture', picture);
                            }

                            if (price) {
                              formData.append('price', price);
                            }

                            updateProduct({id: data._id, dataUpdated: formData});
                          })
                          .then(() => this.setState({editing: false}))
                          .catch(error => console.log(error));
                      }}
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
          <Card.Content className={styles['card-content']}>
            <Card.Header>
              <p className={styles['card-content-paragraph']}>
                {(titleExtended || data.name.length <= 30) ? data.name : `${data.name.slice(0, 30)}`}
                <span
                  className={styles['show-more']}
                  onClick={() => data.name.length > 30 ? this.setState({titleExtended: !titleExtended}) : null}
                >
                  {data.name.length > 30 && (
                    <span className={styles['show-more']}>
                      {`... ${(titleExtended || data.name.length <= 30) ? 'Menos' : 'Más'}`}
                    </span>
                  )}
                </span>
              </p>
            </Card.Header>

            <Card.Meta>
              <span>{data.price}</span>
            </Card.Meta>

            <Card.Description>
              <p>
              {(descriptionExtended || data.description.length <= 175) ? data.description : `${data.description.slice(0, 175)}`}

                <span
                  className={styles['show-more']}
                  onClick={() => data.description.length > 175 ? this.setState({descriptionExtended: !descriptionExtended}) : null}
                >
                  {data.description.length > 175 && (
                    <span className={styles['show-more']}>
                      {`... ${(descriptionExtended || data.description.length <= 175) ? 'Menos' : 'Más'}`}
                    </span>
                  )}
                </span>
              </p>
            </Card.Description>
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

export default connect(mapStateToProps, mapDispatchToProps)(Product);
