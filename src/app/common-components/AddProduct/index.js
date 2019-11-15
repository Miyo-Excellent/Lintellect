//  Dependencies
import React, {Component} from 'react';
import { Form, Segment, Header, Icon, Button } from 'semantic-ui-react';
import {connect} from 'react-redux';
//  import _ from 'lodash';

//  API
import {onCreateNewProduct} from '../../api';

//  Styles
import styles from './addProduct.scss';
import {fetchProducts} from '../Products/actions';

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [
        {text: 'Computadoras', value: 'computers'},
        {text: 'Telefonos', value: 'phones'},
        {text: 'accesorios', value: 'accesories'}
      ],
      formData: {
        name: '',
        price: '',
        picture: '',
        description: '',
        category: ''
      },
      isLoading: false
    };

    this.handleChangeFormData = this.handleChangeFormData.bind(this);
    this.handleCreateNewProduct = this.handleCreateNewProduct.bind(this);
  }

  handleChangeFormData({key = '', value}) {
    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        [key]: value
      }
    }));
  }

  async handleCreateNewProduct() {
    await this.setState({isLoading: true}, async () => {
      const {user} = this.props;
      const {name, price, picture, description, category} = this.state.formData;
      const isValid = [user, name, price, picture, description, category].every(element => !!element);

      if (isValid) {
        const formData = new FormData();

        formData.append('user', JSON.stringify(user));
        formData.append('name', name);
        formData.append('price', price);
        formData.append('picture', picture);
        formData.append('description', description);
        formData.append('category', category);

        onCreateNewProduct(formData).then(data => {
          this.setState(state => ({
            ...state,
            formData: {
              ...state.formData,
              name: '',
              price: '',
              picture: '',
              description: '',
              category: ''
            }
          }),
          () => this.setState(
            {isLoading: false},
            async () => await this.props.updateProducts()
          ));
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.setState({isLoading: false}, () => {
          if (!name) {
            alert('es necesario darle un nombre al producto');
          }

          if (!price) {
            alert('es necesario darle un precio al producto');
          }

          if (!picture) {
            alert('es necesaria una imagen para el producto');
          }

          if (!description) {
            alert('es necesario darle una descripción al producto');
          }

          if (!category) {
            alert('es necesario darle una categoria al producto');
          }
        });
      }
    });
  }

  render() {
    const {categories, formData, isLoading} = this.state;
    const {} = this.props;

    return (
      <div className={styles.container}>
        {isLoading && <div className={styles.loader}/>}

        <Form loading={isLoading}>
          {!isLoading && (
            <div className={styles.mv10}>
              <Form.Group widths='equal'>
                <Form.Input
                  fluid
                  label='Nombre'
                  placeholder={formData ? formData.name : 'Nombre'}
                  onChange={(_event_, {value}) => {
                    this.handleChangeFormData({key: 'name', value});
                  }}
                />

                <Form.Input
                  fluid
                  label='Precio'
                  placeholder={formData ? formData.price : 'Precio'}
                  onChange={(_event_, {value}) => this.handleChangeFormData({key: 'price', value})}
                />

                <Form.Select
                  fluid label='Categorias'
                  options={categories}
                  placeholder='Categorias'
                  onChange={(_event_, {value}) => {
                    this.handleChangeFormData({key: 'category', value});
                  }}
                />
              </Form.Group>

              <Segment placeholder className={[styles.center, styles.column]}>
                <Header icon>
                  <Icon name='pdf file outline' />
                  Solo se permiten archivos de tipo imagen
                </Header>

                <Button
                  primary
                  onClick={(_event_, data) => {
                    const input = document.createElement('input');
                    input.type = 'file';

                    input.addEventListener('change', _e_ => {
                      const file = _e_.target.files[0];

                      this.handleChangeFormData({key: 'picture', value: file});
                    }, false);

                    input.click();
                  }}
                >
                  Añadir Imagen
                </Button>
              </Segment>
            </div>
          )}

          {!isLoading && (
            <Form.TextArea
              label='Descripción'
              placeholder={formData ? formData.description : 'Tell us more about product...'}
              onChange={(_event_, {value}) => this.handleChangeFormData({key: 'description', value})}
            />
          )}

          {!isLoading && (
            <Form.Button onClick={this.handleCreateNewProduct}>Crear</Form.Button>
          )}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.app.user
});

const mapDispatchToProps = dispatch => ({
  updateProducts: (options = {}) => fetchProducts(dispatch, options)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
