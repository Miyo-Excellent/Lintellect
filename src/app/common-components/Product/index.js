//  Dependencies
import React, {Component} from 'react';
import {Card, Image, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';

//  Actions
import {fetchDeleteProducts, fetchUpdateProducts} from '../../Products/actions';

//  Styles
import styles from './product.scss';

class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };
  }

  render() {
    const {data, deleteProduct} = this.props;

    return (
      <Card>
        <Image src={data.picture} alt={data.name} wrapped ui={false}/>

        <Card.Content>
          <Card.Header>Matthew</Card.Header>

          <Card.Meta>
            <span className='date'>Joined in 2015</span>
          </Card.Meta>

          <Card.Description>
            Matthew is a musician living in Nashville.
          </Card.Description>
        </Card.Content>

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
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  products: state.products.products
});

const mapDispatchToProps = dispatch => ({
  updateProduct: (dataUpdated = {}) => fetchUpdateProducts(dispatch, dataUpdated),
  deleteProduct: id => fetchDeleteProducts(dispatch, id)
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
