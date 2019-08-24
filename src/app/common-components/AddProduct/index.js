//  Dependencies
import React, {Component} from 'react';
import {Form} from 'semantic-ui-react';
import {connect} from 'react-redux';
//  import _ from 'lodash';

//  API
import {onCreateNewProduct} from '../Products/api';

//  Styles
import styles from './addProduct.scss';

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = dispatch => ({});

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
      }
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
    const {name,price,picture,description,category} = this.state.formData;

    const formData = new FormData();

    formData.append('name', name);
    formData.append('price', price);
    formData.append('picture', picture);
    formData.append('description', description);
    formData.append('category', category);

    await onCreateNewProduct(formData);
  }

  render() {
    const {categories, formData} = this.state;
    const {} = this.props;

    return (
      <div className={styles.container}>
        <Form>
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
              type="file"
              label='Imagen'
              placeholder={formData ? formData.picture : 'Imagen'}
              onChange={(_event_, data) => {
                const file = _event_.target.files[0];

                this.handleChangeFormData({key: 'picture', value: file});
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

          <Form.TextArea
            label='Descripción'
            placeholder={formData ? formData.description : 'Tell us more about product...'}
            onChange={(_event_, {value}) => this.handleChangeFormData({key: 'description', value})}
          />

          <Form.Button onClick={this.handleCreateNewProduct}>
            Submit
          </Form.Button>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
