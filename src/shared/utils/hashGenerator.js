import bcrypt from 'bcryptjs';

export default function hashGenerator(password, salt, onSuccess, onError) {
  bcrypt.genSalt(salt, function (error, _salt_) {
    if (error) {
      return onError();
    }

    bcrypt.hash(password, _salt_, function (err, hash) {
      if (error) {
        return onError();
      }

      onSuccess(hash);
    });
  });
}
