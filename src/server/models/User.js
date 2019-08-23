//  Dependencies
import mongoose, {Schema} from 'mongoose';

//  Schema
const UserSchema = Schema({
  email: {type: String, unique: true, lowercase: true},
  name: String,
  avatar: String,
  password: {type: String},
  singUpDate: {type: Date, default: Date.now()},
  lastLogin: Date
});

export default mongoose.model('User', UserSchema);
