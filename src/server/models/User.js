//  Dependencies
import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

//  Schema
const UserSchema = Schema({
  email: {type: String, unique: true, lowercase: true},
  name: String,
  avatar: String,
  password: {type: String, select: false},
  singUpDate: {type: Date, default: Date.now()},
  lastlogin: Date
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(10, (error, salt) => {
    if (error) return next();

    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (error) return next();

      this.password = hash;
      next();
    });
  });
});

UserSchema.methods.gravatar = function () {
  const user = this;
  if (!user.email) return `https://gravatar.com/avatar/?s=200&d=retro`;

  const md5 = crypto.createHash('md5').update(user.email).digest('hex');

  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
};

export default mongoose.model('User', UserSchema);
