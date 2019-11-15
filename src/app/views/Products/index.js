// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container} from 'semantic-ui-react';
import ProductsComponent from '../../common-components/Products';
import AddProduct from '../../common-components/AddProduct';
import {Layout, Tabs} from '../../common-components';

//  Actions

// Styles
import styles from './products.scss';

class Products extends Component {
  static navRenderChildren(path) {
    switch (path) {
      case 'products':
        return <ProductsComponent />;

      case 'newProduct':
        return <AddProduct />;

      default:
        return null;
    }
  }

  constructor(props) {
    super(props);

    this.nav = [
      {title: 'Productos', Children: () => Products.navRenderChildren('products')},
      {title: 'Crear un Producto', Children: () => Products.navRenderChildren('newProduct')}
    ];

    this.state = {};
  }

  render() {
    const {nav} = this;

    return (
      <Layout {...this.props}>
        <Container>
          <div className={[styles.home]}>
            <Tabs data={nav}/>
          </div>
        </Container>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
