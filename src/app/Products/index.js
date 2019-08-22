//  Dependencies
import React, {Component} from 'react';
import _ from 'lodash';

//  API
import {onDeleteProduct, onEditProduct} from './api';

//  common components
import {Product} from '../common-components';

//  Styles
import styles from './products.scss';
import {fetchProducts} from "./actions";
import {connect} from "react-redux";

class Products extends Component {
  static onclickProduct({id, type = '', dataUpdated = {}}) {
    debugger;
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

  componentWillMount() {
    this.props.updateProducts();
  }


  render() {
    const {products, updateProducts} = this.props;

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

const mapDispatchToProps = dispatch => ({
  updateProducts: (options = {}) => fetchProducts(dispatch, options)
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
