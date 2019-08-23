//  Dependencies
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

//  Models
import {User} from '../models';

//  Services
import {createToken} from '../services';

function hashGenerator(password, salt, callback, onError) {
  bcrypt.genSalt(salt, function (error, _salt_) {
    if (error) {
      return onError();
    }

    bcrypt.hash(password, _salt_, function (err, hash) {
      if (error) {
        return onError();
      }

      callback(hash);
    });
  });
}

function getGravatar(email) {
  if (!email) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }

  const md5 = crypto.createHash('md5').update(email).digest('hex');

  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
}

export async function signIn(req, res, next) {
  const email = req.body.email || req.query.email;
  const password = req.body.password || req.query.password;

  if (email) {
    if (password) {
      const user = await User.findOne({ email }).exec();
      debugger;

      if (!user) {
        debugger;
        res.status(404).send({message: 'El usuario no existe'});
        return next();
      }

      const passwordCompare = bcrypt.compareSync(password, user.password);
      debugger;

      if (!passwordCompare) {
        debugger;
        res.status(400).send({message: 'Ingresa una contraseña Valida'});
        return next();
      }

      debugger;
      res.status(200).send({
        user: {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          email
        },
        message: 'Te has logeado correctamente',
        token: createToken(user)
      });
      return next();
    } else {
      res.status(500).send({message: 'Ingresa una contraseña Valida'});
      return next();
    }
  } else {
    res.status(500).send({message: 'Ingresa un email Valido'});
    return next();
  }
}

export async function signInWithGoogle(req, res, next) {
  const email = req.body.email || req.query.email;

  await User.find({email}, function (error, user) {
    if (error) {
      res.status(500).send({message: error});
      return next();
    }

    if (!user[0]) {
      return signUp(req, res, next);
    }

    req.user = user;

    res.status(200).send({
      message: 'Te has logeado correctamente',
      token: createToken(user)
    });
    return next();
  });
}

export async function signUp(req, res, next) {
  const email = req.body.email || req.query.email;
  const name = req.body.name || req.query.name;
  const password = req.body.password || req.query.password;

  if (email) {
    if (password) {
      if (name) {
        hashGenerator(
          password,
          10,
          function(cryptoPassword) {
            if (cryptoPassword) {
              const user = new User({
                email,
                name,
                password: cryptoPassword,
                avatar: getGravatar(email)
              });

              user.save(function (error, userStored) {
                if (error) {
                  res.status(500).send({message: `Error al guardar el usario en la base de datos ${error}`});
                  return next();
                }

                if (!userStored) {
                  return res.status(404).send({message: 'El usuario no existe'});
                }

                const token = createToken(user);

                res.status(200).send({
                  user: {
                    id: userStored._id,
                    name: userStored.name,
                    avatar: userStored.avatar,
                    email
                  },
                  token
                });
              });
            }
          },
          function() {
            res.status(500).send({message: 'Ingresa una contraseña valida'});
            return next();
          }
        );
      } else {
        res.status(500).send({message: 'Ingresa un nombre de usuario'});
        return next();
      }
    } else {
      res.status(500).send({message: 'Ingresa una contraseña'});
      return next();
    }
  } else {
    res.status(500).send({message: 'Ingresa un email Valido'});
    return next();
  }
}
