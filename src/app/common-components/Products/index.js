//  Dependencies
import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

//  API
import {onDeleteProduct, onEditProduct} from '../../api';

//  Actions
import {fetchProducts} from './actions';

//  common components
import {Product} from '../index';

//  Styles
import styles from './products.scss';

class Products extends Component {
  static onclickProduct({id, type = '', dataUpdated = {}}) {
    switch (type) {
      case 'delete':
        return onDeleteProduct(id);
      case 'edit':
        return onEditProduct({dataUpdated});
      default:
        return null;
    }
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {products} = this.props;

    return (
      <div className={styles.products}>
        {_.map(products, (product, index) => (
          <div className={styles.product} key={`${product.name}${index}`}>
            <Product data={product} />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products: state.products.products
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
