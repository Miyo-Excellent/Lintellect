// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container} from 'semantic-ui-react';
import Products from '../Products';
import {Layout, Tabs} from '../common-components';

//  Actions

// Styles
import styles from './home.scss';

class Home extends Component {
  static navRenderChildren(path) {
    switch (path) {
      case 'products':
        return <Products />;

      case 'newProduct':
        return null;

      default:
        return null;
    }
  }

  constructor(props) {
    super(props);

    this.nav = [
      {title: 'Productos', Children: () => Home.navRenderChildren('products')},
      {title: 'Crear un Producto', Children: () => Home.navRenderChildren('newProduct')}
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
