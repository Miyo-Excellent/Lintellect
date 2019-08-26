//  Dependencies
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import multiparty from 'multiparty';
import _ from 'lodash';

import logger from '../logger';
import validations from '../validations';

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
  const form = new multiparty.Form();

  form.parse(req, async function (err, {email, password }, files) {
    logger.info(`POST:[IP: ${req.ip}] Inicio de sesion con Lintellect (usuario: ${email[0]})`);
    console.info(`POST:[IP: ${req.ip}] Inicio de sesion con Lintellect (usuario: ${email[0]})`);

    const {error, value} = validations({
      key: 'user_sign_in',
      options: { email: email[0], password: password[0] }
    });

    if (error) {
      logger.info(`ERROR :: POST:[ip:${req.ip}] /signin ${error}`);
      console.info(`ERROR :: POST:[ip:${req.ip}] /signin`, error);

      res.status(500).send({message: error});
      return next();
    }

    const user = await User.findOne({ email: email[0] }).exec();

    if (!user) {
      logger.error(`POST:[IP: ${req.ip}] El usuario [email: ${email[0]}] no existe`);
      console.error(`POST:[IP: ${req.ip}] El usuario [email: ${email[0]}] no existe`);

      res.status(404).send({message: 'El usuario no existe'});

      return next();
    }

    const passwordCompare = bcrypt.compareSync(password[0], user.password);

    if (!passwordCompare) {
      logger.error(`POST:[IP: ${req.ip}] Ingresa una contraseña Valida`);
      console.error(`POST:[IP: ${req.ip}] Ingresa una contraseña Valida`);

      res.status(400).send({message: 'Ingresa una contraseña Valida'});

      return next();
    }

    logger.info(`POST:[IP: ${req.ip}] El usuario ${email[0]} se ha logeado correctamente`);
    console.info(`POST:[IP: ${req.ip}] El usuario ${email[0]} se ha logeado correctamente`);

    res.status(200).send({
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: email[0]
      },
      message: 'Te has logeado correctamente',
      token: createToken(user)
    });
    return next();
  });
}

export async function signInWithGoogle(req, res, next) {
  const form = new multiparty.Form();

  form.parse(req, async function (err, { email, name, uid }, files) {
    const {error, value} = validations({
      key: 'user_sign_in_with_google',
      options: {
        email: email[0],
        name: name[0],
        password: uid[0]
      }
    });

    if (error) {
      logger.info(`ERROR :: POST:[ip:${req.ip}] /signin-with-google ${error}`);
      console.info(`ERROR :: POST:[ip:${req.ip}] /signin`, error);

      res.status(500).send({message: error});
      return next();
    }

    logger.info(`POST:[IP: ${req.ip}] Inicio de sesion con Google Firebase (usuario: ${email[0]})`);
    console.info(`POST:[IP: ${req.ip}] Inicio de sesion con Google Firebase (usuario: ${email[0]})`);

    await User.find({email: email[0]}, function (error, user) {
      if (error) {
        logger.warn(`POST:[IP: ${req.ip}] Error al ingresar mediante Google Firebase (usuario: ${email[0]})`);
        console.warn(`POST:[IP: ${req.ip}] Error al ingresar mediante Google Firebase (usuario: ${email[0]})`);

        res.status(500).send({message: error});

        return next();
      }

      if (_.isEmpty(user)) {
        return signUp(req, res, next, {
          googleData: {
            email: email[0],
            uid: uid[0],
            name: name[0]
          }
        });
      }

      logger.info(`POST:[IP: ${req.ip}] Te has logeado correctamente (usuario: ${email[0]})`);
      console.info(`POST:[IP: ${req.ip}] Te has logeado correctamente (usuario: ${email[0]})`);

      res.status(200).send({
        message: 'Te has logeado correctamente',
        token: createToken(user)
      });

      return next();
    });
  });
}

export async function signUp(req, res, next, extra) {
  const form = new multiparty.Form();

  let options = {};

  const onError = error => {
    logger.info(`ERROR :: POST:[ip:${req.ip}] /signup ${error}`);
    console.info(`ERROR :: POST:[ip:${req.ip}] /signin`, error);

    res.status(500).send({message: error});
    return next();
  };

  const onSuccess = () => {
    logger.info(`POST:[IP: ${req.ip}] Inciando creación de usuario Lintellect`);
    console.info(`POST:[IP: ${req.ip}] Inciando creación de usuario Lintellect`);
  };

  const onHashGenError = () => {
    logger.warn(`POST:[IP: ${req.ip}] Ingresar una contraseña valida (usuario: ${options.email})`);
    console.warn(`POST:[IP: ${req.ip}] Ingresar una contraseña valida (usuario: ${options.email})`);

    res.status(500).send({message: 'Ingresa una contraseña valida'});

    return next();
  };

  const onHashGenSuccess = cryptoPassword => {
    if (cryptoPassword) {
      const user = new User({
        email: options.email,
        name: options.name,
        password: cryptoPassword,
        avatar: getGravatar(options.email)
      });

      user.save(function (error, userStored) {
        if (error) {
          logger.warn(`POST:[IP: ${req.ip}] Error al guardar el usario en la base de datos 
                  Usuario: ${options.email}
                  Error: ${error}`);

          console.warn(`POST:[IP: ${req.ip}] Error al guardar el usario en la base de datos 
                  Usuario: ${options.email}
                  Error: ${error}`);

          res.status(500).send({message: `Error al guardar el usario en la base de datos ${error}`});
          return next();
        }

        if (!userStored) {
          logger.error(`POST:[IP: ${req.ip}] El usuario no existe (usuario: ${options.email})`);
          console.error(`POST:[IP: ${req.ip}] El usuario no existe (usuario: ${options.email})`);

          return res.status(404).send({message: 'El usuario no existe'});
        }

        const token = createToken(user);

        logger.info(`POST:[IP: ${req.ip}] Han ingresado con el usuario (${options.email})`);
        console.info(`POST:[IP: ${req.ip}] Han ingresado con el usuario (${options.email})`);

        res.status(200).send({
          user: {
            id: userStored._id,
            name: userStored.name,
            avatar: userStored.avatar,
            email: options.email
          },
          token
        });

        return next();
      });
    }
  };

  const onSave = (data) => {
    const { error, value } = validations({ key: 'user_sign_up', data });

    if (error) {
      onError(error);
    }

    onSuccess();

    hashGenerator(data.password, 10, onHashGenSuccess, onHashGenError );
  };

  if (!_.isEmpty(extra) && !_.isEmpty(extra.googleData)) {
    options = {
      email: extra.googleData.email,
      name: extra.googleData.name,
      password: extra.googleData.uid
    };

    onSave(options);
  } else {
    form.parse(req, function (err, { email, name, password }, files) {
      options = {
        email: email[0],
        name: name[0],
        password: password[0]
      };

      onSave(options);
    });
  }
}
