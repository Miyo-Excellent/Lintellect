//  Dependencies
import mongoose, {Schema} from 'mongoose';

//  Schema
const ClientSchema = Schema({
  email: {type: String, unique: true, lowercase: true},
  name: String,
  avatar: String,
  rol: String,
  password: {type: String},
  singUpDate: {type: Date, default: Date.now()}
  //  lastLogin: Date,
  //  token: {type: String, unique: true, lowercase: true}
});

export default mongoose.model('Client', ClientSchema);
