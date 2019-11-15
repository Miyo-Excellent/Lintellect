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
import {Client} from '../models';

//  Services
import {createToken} from '../services';

export async function getClients(req, res) {
  logger.info(`GET:[ip:${req.ip}] /api/client`);
  console.info(`GET:[ip:${req.ip}] /api/client`);

  await Client.find(function (error, client) {
    if (error) {
      logger.error(`GET:[ip:${req.ip}] Error al solicitar los Clientes en la base de datos ${error}`);
      console.error(`GET:[ip:${req.ip}] Error al solicitar los Clientes en la base de datos ${error}`);

      return res.status(500).send({message: `Error al solicitar los Clientes en la base de datos ${error}`});
    }

    if (!client) {
      logger.error(`GET:[ip:${req.ip}] No hay Clientes disponibles`);
      console.error(`GET:[ip:${req.ip}] No hay Clientes disponibles`);

      return res.status(404).send({message: 'No hay Clientes disponibles'});
    }

    logger.info(`GET:[ip:${req.ip}] Han solicitado todos los Clientes`);
    console.info(`GET:[ip:${req.ip}] Han solicitado todos los Clientes`);

    return res.status(200).send({
      client: _.map(client, ({avatar, email, name, _id}) => ({
        avatar,
        email,
        name,
        id: _id,
        products: [],
        rol: 'USER'
      }))
    });
  });
}

export async function getClient(req, res) {
  logger.info(`GET:[ip:${req.ip}] /api/client`);
  console.info(`GET:[ip:${req.ip}] /api/client`);

  const clientId = req.params.clientId || req.body.clientId || req.query.clientId;

  await Client.findById(clientId, function (error, client) {
    if (error) {
      logger.error(`GET:[ip:${req.ip}] Error al solicitar cliente en la base de datos ${error}`);
      console.error(`GET:[ip:${req.ip}] Error al solicitar cliente en la base de datos ${error}`);

      return res.status(500).send({message: `Error al solicitar cliente en la base de datos ${error}`});
    }

    if (!client) {
      logger.error(`GET:[ip:${req.ip}] El cliente [ID: ${clientId}] no existe`);
      console.error(`GET:[ip:${req.ip}] El cliente [ID: ${clientId}] no existe`);

      return res.status(404).send({message: 'El cliente no existe'});
    }

    logger.info(`GET:[ip:${req.ip}] Han solicitado el cliente [ID: ${clientId}]`);
    console.info(`GET:[ip:${req.ip}] Han solicitado el cliente [ID: ${clientId}]`);

    debugger;
    return res.status(200).send({client});
  });
}

export async function deleteClient(req, res) {
  logger.info(`DELETE:[ip:${req.ip}] /api/client`);
  console.info(`DELETE:[ip:${req.ip}] /api/client`);

  const {clientId} = await req.params;

  await Client.findById(clientId, function (error, client) {
    if (error) {
      logger.error(`DELETE:[IP: ${req.ip}] Error al borrar el cliente [ID: ${clientId}] ${error}`);
      console.error(`DELETE:[IP: ${req.ip}] Error al borrar el cliente [ID: ${clientId}] ${error}`);

      return res.status(500).send({message: `Error al borrar el cliente en la base de datos ${error}`});
    }

    if (!client) {
      logger.error(`DELETE:[IP: ${req.ip}] El cliente [ID: ${clientId}] no existe ${error}`);
      console.error(`DELETE:[IP: ${req.ip}] El cliente [ID: ${clientId}] no existe ${error}`);

      return res.status(404).send({message: 'El cliente no existe'});
    }

    client.remove(error => {
      if (error) {
        logger.error(`DELETE:[IP: ${req.ip}] Error al guardar el cliente [ID: ${clientId}] en la base de datos ${error}`);
        console.error(`DELETE:[IP: ${req.ip}] Error al guardar el cliente [ID: ${clientId}] en la base de datos ${error}`);

        return res.status(500).send({message: `Error al guardar cliente en la base de datos ${error}`});
      }

      logger.error(`DELETE:[IP: ${req.ip}] El cliente [ID: ${clientId}] ha sido eliminado`);
      console.error(`DELETE:[IP: ${req.ip}] El cliente [ID: ${clientId}] ha sido eliminado`);

      res.status(200).send({message: 'El cliente ha sido eliminado', client});
    });
  });
}

export async function signIn(req, res, next) {
  const form = new multiparty.Form();

  form.parse(req, async function (err, {email, password}, files) {
    logger.info(`POST:[IP: ${req.ip}] Inicio de sesion con Lintellect (cliente: ${email[0]})`);
    console.info(`POST:[IP: ${req.ip}] Inicio de sesion con Lintellect (cliente: ${email[0]})`);

    const {error, value} = validations({
      key: 'client_sign_in',
      options: {email: email[0], password: password[0]}
    });

    if (error) {
      logger.info(`ERROR :: POST:[ip:${req.ip}] /signin ${error}`);
      console.info(`ERROR :: POST:[ip:${req.ip}] /signin`, error);

      res.status(500).send({message: error});
      return next();
    }

    const client = await Client.findOne({email: email[0]}).exec();

    if (!client) {
      logger.error(`POST:[IP: ${req.ip}] El cliente [email: ${email[0]}] no existe`);
      console.error(`POST:[IP: ${req.ip}] El cliente [email: ${email[0]}] no existe`);

      res.status(404).send({message: 'El cliente no existe'});

      return next();
    }

    const passwordCompare = bcrypt.compareSync(password[0], client.password);

    if (!passwordCompare) {
      logger.error(`POST:[IP: ${req.ip}] Ingresa una contraseña Valida`);
      console.error(`POST:[IP: ${req.ip}] Ingresa una contraseña Valida`);

      res.status(400).send({message: 'Ingresa una contraseña Valida'});

      return next();
    }

    const token = createToken(client);
    const clientData = {
      avatar: client.avatar,
      email: client.email,
      id: client.id,
      name: client.name,
      rol: client.rol
    };

    logger.info(`POST:[IP: ${req.ip}] El cliente ${email[0]} se ha logeado correctamente`);
    console.info(`POST:[IP: ${req.ip}] El cliente ${email[0]} se ha logeado correctamente`);

    res.locals.client = client;
    req.session.client = client;
    req.session.token = token;

    res.status(200).send({
      client: clientData,
      message: 'Te has logeado correctamente',
      token
    });
    return next();
  });
}

export async function signInWithGoogle(req, res, next) {
  const form = new multiparty.Form();

  form.parse(req, async function (err, {email, name, uid}, files) {
    const {error, value} = validations({
      key: 'client_sign_in_with_google',
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

    logger.info(`POST:[IP: ${req.ip}] Inicio de sesion con Google Firebase (cliente: ${email[0]})`);
    console.info(`POST:[IP: ${req.ip}] Inicio de sesion con Google Firebase (cliente: ${email[0]})`);

    await Client.find({email: email[0]}, function (error, client) {
      if (error) {
        logger.warn(`POST:[IP: ${req.ip}] Error al ingresar mediante Google Firebase (cliente: ${email[0]})`);
        console.warn(`POST:[IP: ${req.ip}] Error al ingresar mediante Google Firebase (cliente: ${email[0]})`);

        res.status(500).send({message: error});

        return next();
      }

      if (_.isEmpty(client)) {
        return signUp(req, res, next, {
          googleData: {
            email: email[0],
            uid: uid[0],
            name: name[0]
          }
        });
      }

      logger.info(`POST:[IP: ${req.ip}] Te has logeado correctamente (cliente: ${email[0]})`);
      console.info(`POST:[IP: ${req.ip}] Te has logeado correctamente (cliente: ${email[0]})`);

      res.status(200).send({
        message: 'Te has logeado correctamente',
        client: {
          avatar: client[0].avatar,
          email: client[0].email,
          id: client[0].id,
          name: client[0].name
        },
        token: createToken(client)
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
    logger.info(`POST:[IP: ${req.ip}] Inciando creación de cliente Lintellect`);
    console.info(`POST:[IP: ${req.ip}] Inciando creación de cliente Lintellect`);
  };

  const onHashGenError = () => {
    logger.warn(`POST:[IP: ${req.ip}] Ingresar una contraseña valida (cliente: ${options.email})`);
    console.warn(`POST:[IP: ${req.ip}] Ingresar una contraseña valida (cliente: ${options.email})`);

    res.status(500).send({message: 'Ingresa una contraseña valida'});

    return next();
  };

  const onHashGenSuccess = cryptoPassword => {
    if (cryptoPassword) {
      const client = new Client({
        email: options.email,
        name: options.name,
        password: cryptoPassword,
        avatar: getGravatar(options.email)
      });

      client.save(function (error, clientStored) {
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

        if (!clientStored) {
          logger.error(`POST:[IP: ${req.ip}] El cliente no existe (cliente: ${options.email})`);
          console.error(`POST:[IP: ${req.ip}] El cliente no existe (cliente: ${options.email})`);

          return res.status(404).send({message: 'El cliente no existe'});
        }

        const token = createToken(client);

        logger.info(`POST:[IP: ${req.ip}] Han ingresado con el cliente (${options.email})`);
        console.info(`POST:[IP: ${req.ip}] Han ingresado con el cliente (${options.email})`);

        res.status(200).send({
          client: {
            id: clientStored._id,
            name: clientStored.name,
            avatar: clientStored.avatar,
            email: options.email,
            rol: 'CLIENT'
          },
          token
        });

        return next();
      });
    }
  };

  const onSave = (data) => {
    const {error, value} = validations({key: 'client_sign_up', data});

    if (error) {
      onError(error);
    }

    onSuccess();

    hashGenerator(data.password, 10, onHashGenSuccess, onHashGenError);
  };

  if (!_.isEmpty(extra) && !_.isEmpty(extra.googleData)) {
    options = {
      email: extra.googleData.email,
      name: extra.googleData.name,
      password: extra.googleData.uid
    };

    onSave(options);
  } else {
    form.parse(req, function (err, {email, name, password}, files) {
      options = {
        email: email[0],
        name: name[0],
        password: password[0]
      };

      onSave(options);
    });
  }
}
