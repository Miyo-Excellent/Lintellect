//  Dependencies
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

//  Models
import {User} from '../models';

//  Services
import {createToken} from '../services';
import logger from '../logger';

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

  logger.info(`POST:[IP: ${req.ip}] Inicio de sesion con Lintellect (usuario: ${email})`);
  console.info(`POST:[IP: ${req.ip}] Inicio de sesion con Lintellect (usuario: ${email})`);

  if (email) {
    if (password) {
      const user = await User.findOne({ email }).exec();

      if (!user) {
        logger.error(`POST:[IP: ${req.ip}] El usuario [email: ${email}] no existe`);
        console.error(`POST:[IP: ${req.ip}] El usuario [email: ${email}] no existe`);

        res.status(404).send({message: 'El usuario no existe'});

        return next();
      }

      const passwordCompare = bcrypt.compareSync(password, user.password);

      if (!passwordCompare) {
        logger.error(`POST:[IP: ${req.ip}] Ingresa una contraseña Valida`);
        console.error(`POST:[IP: ${req.ip}] Ingresa una contraseña Valida`);

        res.status(400).send({message: 'Ingresa una contraseña Valida'});

        return next();
      }

      logger.info(`POST:[IP: ${req.ip}] El usuario ${email} se ha logeado correctamente`);
      console.info(`POST:[IP: ${req.ip}] El usuario ${email} se ha logeado correctamente`);

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
      logger.warn(`POST:[IP: ${req.ip}] Ingresar una contraseña valida (usuario: ${email})`);
      console.warn(`POST:[IP: ${req.ip}] Ingresar una contraseña valida (usuario: ${email})`);

      res.status(500).send({message: 'Ingresa una contraseña Valida'});

      return next();
    }
  } else {
    logger.warn(`POST:[IP: ${req.ip}] Ingresar un email valido (usuario: ${email})`);
    console.warn(`POST:[IP: ${req.ip}] Ingresar un email valido (usuario: ${email})`);

    res.status(500).send({message: 'Ingresa un email Valido'});

    return next();
  }
}

export async function signInWithGoogle(req, res, next) {
  const email = req.body.email || req.query.email;

  logger.info(`POST:[IP: ${req.ip}] Inicio de sesion con Google Firebase (usuario: ${email})`);
  console.info(`POST:[IP: ${req.ip}] Inicio de sesion con Google Firebase (usuario: ${email})`);

  await User.find({email}, function (error, user) {
    if (error) {
      logger.warn(`POST:[IP: ${req.ip}] Error al ingresar mediante Google Firebase (usuario: ${email})`);
      console.warn(`POST:[IP: ${req.ip}] Error al ingresar mediante Google Firebase (usuario: ${email})`);

      res.status(500).send({message: error});

      return next();
    }

    req.user = user;

    logger.info(`POST:[IP: ${req.ip}] Te has logeado correctamente (usuario: ${email})`);
    console.info(`POST:[IP: ${req.ip}] Te has logeado correctamente (usuario: ${email})`);
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

  logger.info(`POST:[IP: ${req.ip}] Inciando creación de usuario Lintellect`);
  console.info(`POST:[IP: ${req.ip}] Inciando creación de usuario Lintellect`);

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
                  logger.warn(`POST:[IP: ${req.ip}] Error al guardar el usario en la base de datos 
                  Usuario: ${email}
                  Error: ${error}`);

                  console.warn(`POST:[IP: ${req.ip}] Error al guardar el usario en la base de datos 
                  Usuario: ${email}
                  Error: ${error}`);

                  res.status(500).send({message: `Error al guardar el usario en la base de datos ${error}`});
                  return next();
                }

                if (!userStored) {
                  logger.error(`POST:[IP: ${req.ip}] El usuario no existe (usuario: ${email})`);
                  console.error(`POST:[IP: ${req.ip}] El usuario no existe (usuario: ${email})`);

                  return res.status(404).send({message: 'El usuario no existe'});
                }

                const token = createToken(user);

                logger.info(`POST:[IP: ${req.ip}] Han ingresado con el usuario (${email})`);
                console.info(`POST:[IP: ${req.ip}] Han ingresado con el usuario (${email})`);

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
            logger.warn(`POST:[IP: ${req.ip}] Ingresar una contraseña valida (usuario: ${email})`);
            console.warn(`POST:[IP: ${req.ip}] Ingresar una contraseña valida (usuario: ${email})`);

            res.status(500).send({message: 'Ingresa una contraseña valida'});
            return next();
          }
        );
      } else {
        logger.warn(`POST:[IP: ${req.ip}] Ingresa un nombre de usuario valido (usuario: ${email})`);
        console.warn(`POST:[IP: ${req.ip}] Ingresa un nombre de usuario valido (usuario: ${email})`);

        res.status(500).send({message: 'Ingresa un nombre de usuario'});
        return next();
      }
    } else {
      logger.warn(`POST:[IP: ${req.ip}] Ingresa un nombre de usuario valido (usuario: ${email})`);
      console.warn(`POST:[IP: ${req.ip}] Ingresa un nombre de usuario valido (usuario: ${email})`);

      res.status(500).send({message: 'Ingresa una contraseña'});
      return next();
    }
  } else {
    logger.warn(`POST:[IP: ${req.ip}] Ingresa un email valido (usuario: ${email})`);
    console.warn(`POST:[IP: ${req.ip}] Ingresa un email valido (usuario: ${email})`);

    res.status(500).send({message: 'Ingresa un email valido'});
    return next();
  }
}
