import logger from '../../logger';
import getGravatar from '../../../shared/utils/getGravatar';
import {createToken} from '../../services';
import * as Models from '../../models';
import validations from '../../validations';
import hashGenerator from '../../../shared/utils/hashGenerator';
import _ from 'lodash';
import multiparty from 'multiparty';

export default class User {
  static onError = error => {
    logger.info(`ERROR :: GRAPHQL: /signup ${error}`);
    console.info('ERROR :: GRAPHQL: /signin', error);

    return ({message: error});
  };

  static onSuccess = () => {
    logger.info('SUCCESS :: GRAPHQL:  Inciando creación de usuario Lintellect');
    console.info('SUCCESS :: GRAPHQL:  Inciando creación de usuario Lintellect');
  };

  static onHashGenError = () => {
    logger.warn('ERROR :: GRAPHQL: Ingresar una contraseña valida');
    console.warn('ERROR :: GRAPHQL: Ingresar una contraseña valida');
  };

  static onHashGenSuccess = ({password, email, name}) => {
    const user = new Models.User({
      email,
      name,
      password,
      avatar: getGravatar(email)
    });

    return user.save(function (error, userStored) {
      if (error) {
        logger.warn(`ERROR :: GRAPHQL: Error al guardar el usario en la base de datos 
                  Usuario: ${email}
                  Error: ${error}`);

        console.warn(`ERROR :: GRAPHQL: Error al guardar el usario en la base de datos 
                  Usuario: ${options.email}
                  Error: ${error}`);
        return null;
      }

      if (!userStored) {
        logger.error(`GRAPHQL: El usuario no existe (usuario: ${email})`);
        console.error(`GRAPHQL: El usuario no existe (usuario: ${email})`);

        return null;
      }

      const token = createToken(user);

      logger.info(`GRAPHQL: Han ingresado con el usuario (${email})`);
      console.info(`GRAPHQL: Han ingresado con el usuario (${email})`);

      return {
        id: userStored._id,
        name: userStored.name,
        avatar: userStored.avatar,
        email: options.email,
        token
      };
    });
  };

  static onSave = ({data, extra}) => {
    const {error, value} = validations({key: 'user_sign_up', data});

    let options = {};

    if (error) {
      User.onError(error);
    }

    User.onSuccess();

    if (!_.isEmpty(extra) && !_.isEmpty(extra.googleData)) {
      options = {
        email: extra.googleData.email,
        name: extra.googleData.name,
        password: extra.googleData.uid
      };
    } else {
      const form = new multiparty.Form();

      form.parse({}, function (err, {email, name, password}, files) {
        options = {
          email: email[0],
          name: name[0],
          password: password[0]
        };
      }
      );
    }

    return hashGenerator(data.password, 10, password => User.onHashGenSuccess({...options, password})
      .then(newUserData => {

      }).catch(User.onHashGenError), User.onHashGenError);
  };

  constructor({email, password, name, _id}) {
    this.id = _id;
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
