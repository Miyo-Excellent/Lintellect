//  Dependencies
import mongoose, {Schema} from 'mongoose';

//  Models
import {User} from './';

//  Schema
const ProductSchema = Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  picture: {
    ids: {type: String, unique: true},
    url: {type: String, unique: true}
  },
  price: Number,
  category: {
    type: String,
    enum: ['computers', 'phones', 'accesories']
  }
});

ProductSchema.virtual('userData')
  .get(function () {
    User.findOne(function (err, kitten) {
      if (err) {
        console.log(err);

        return null;
      }

      return kitten;
    });
  })
  .set(function (user) {
    this.user = user;
  });

export default mongoose.model('Product', ProductSchema);
