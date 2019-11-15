//  Dependencies
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import multiparty from 'multiparty';
import _ from 'lodash';

import logger from '../logger';
import validations from '../validations';

//  Utils
import hashGenerator from '../../shared/utils/hashGenerator';
import getGravatar from '../../shared/utils/getGravatar';

//  Models
import {User} from '../models';

//  Services
import {createToken} from '../services';

export async function getUsers(req, res) {
  logger.info(`GET:[ip:${req.ip}] /api/users`);
  console.info(`GET:[ip:${req.ip}] /api/users`);

  await User.find(function (error, users) {
    if (error) {
      logger.error(`GET:[ip:${req.ip}] Error al solicitar los usuarios en la base de datos ${error}`);
      console.error(`GET:[ip:${req.ip}] Error al solicitar los usuarios en la base de datos ${error}`);

      return res.status(500).send({message: `Error al solicitar los usuarios en la base de datos ${error}`});
    }

    if (!users) {
      logger.error(`GET:[ip:${req.ip}] No hay usuarios disponibles`);
      console.error(`GET:[ip:${req.ip}] No hay usuarios disponibles`);

      return res.status(404).send({message: 'No hay usuarios disponibles'});
    }

    logger.info(`GET:[ip:${req.ip}] Han solicitado todos los usuarios`);
    console.info(`GET:[ip:${req.ip}] Han solicitado todos los usuarios`);

    return res.status(200).send({users: _.map(users, ({avatar, email, name, _id, rol}) => ({
      avatar,
      email,
      name,
      id: _id,
      products: [],
      rol
    }))});
  });
}

export async function getUser(req, res) {
  logger.info(`GET:[ip:${req.ip}] /api/user`);
  console.info(`GET:[ip:${req.ip}] /api/user`);

  const userId = req.params.userId || req.body.userId || req.query.userId;

  await User.findById(userId, function (error, user) {
    if (error) {
      logger.error(`GET:[ip:${req.ip}] Error al solicitar usuario en la base de datos ${error}`);
      console.error(`GET:[ip:${req.ip}] Error al solicitar usuario en la base de datos ${error}`);

      return res.status(500).send({message: `Error al solicitar usuario en la base de datos ${error}`});
    }

    if (!user) {
      logger.error(`GET:[ip:${req.ip}] El usuario [ID: ${userId}] no existe`);
      console.error(`GET:[ip:${req.ip}] El usuario [ID: ${userId}] no existe`);

      return res.status(404).send({message: 'El usuario no existe'});
    }

    logger.info(`GET:[ip:${req.ip}] Han solicitado el usuario [ID: ${userId}]`);
    console.info(`GET:[ip:${req.ip}] Han solicitado el usuario [ID: ${userId}]`);

    debugger;
    return res.status(200).send({user});
  });
}

export async function deleteUser(req, res) {
  logger.info(`DELETE:[ip:${req.ip}] /api/user`);
  console.info(`DELETE:[ip:${req.ip}] /api/user`);

  const {userId} = await req.params;

  await User.findById(userId, function (error, user) {
    if (error) {
      logger.error(`DELETE:[IP: ${req.ip}] Error al borrar el usuario [ID: ${userId}] ${error}`);
      console.error(`DELETE:[IP: ${req.ip}] Error al borrar el usuario [ID: ${userId}] ${error}`);

      return res.status(500).send({message: `Error al borrar el usuario en la base de datos ${error}`});
    }

    if (!user) {
      logger.error(`DELETE:[IP: ${req.ip}] El usuario [ID: ${userId}] no existe ${error}`);
      console.error(`DELETE:[IP: ${req.ip}] El usuario [ID: ${userId}] no existe ${error}`);

      return res.status(404).send({message: 'El usuario no existe'});
    }

    user.remove(error => {
      if (error) {
        logger.error(`DELETE:[IP: ${req.ip}] Error al guardar el usuario [ID: ${userId}] en la base de datos ${error}`);
        console.error(`DELETE:[IP: ${req.ip}] Error al guardar el usuario [ID: ${userId}] en la base de datos ${error}`);

        return res.status(500).send({message: `Error al guardar usuario en la base de datos ${error}`});
      }

      logger.error(`DELETE:[IP: ${req.ip}] El usuario [ID: ${userId}] ha sido eliminado`);
      console.error(`DELETE:[IP: ${req.ip}] El usuario [ID: ${userId}] ha sido eliminado`);

      res.status(200).send({message: 'El usuario ha sido eliminado', user});
    });
  });
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

    const token = createToken(user);
    const userData = {
      avatar: user.avatar,
      email: user.email,
      _id: user.id,
      name: user.name,
      rol: user.rol
    };

    logger.info(`POST:[IP: ${req.ip}] El usuario ${email[0]} se ha logeado correctamente`);
    console.info(`POST:[IP: ${req.ip}] El usuario ${email[0]} se ha logeado correctamente`);

    res.locals.user = user;
    req.session.user = user;
    req.session.token = token;

    debugger;

    res.status(200).send({
      user: userData,
      message: 'Te has logeado correctamente',
      token
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
        user: {
          avatar: user[0].avatar,
          email: user[0].email,
          id: user[0].id,
          name: user[0].name
        },
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
        avatar: getGravatar(options.email),
        rol: 'ADMINISTRATOR'
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
