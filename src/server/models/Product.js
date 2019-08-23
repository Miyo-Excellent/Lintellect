//  Dependencies
import mongoose, {Schema} from 'mongoose';

//  Schema
const ProductSchema = Schema({
  name: String,
  description: String,
  picture: String,
  price: Number,
  category: {
    type: String,
    enum: ['computers', 'phones', 'accesories']
  }
});

export default mongoose.model('Product', ProductSchema);
