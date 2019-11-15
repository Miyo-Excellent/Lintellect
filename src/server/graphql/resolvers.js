//  Dependencies
import validations from '../validations';

//  GraphQL Models
import {User} from './models';

//  Utils
import hashGenerator from '../../shared/utils/hashGenerator';
import logger from '../logger';
import getGravatar from '../../shared/utils/getGravatar';
import {createToken} from '../services';

export default ({
  Query: {},
  Mutation: {
    newUser(root, {input}) {
      const { error, value } = validations({ key: 'user_sign_up', data: input });

      if (error) {
        logger.info(`ERROR :: GRAPHQL: /signup ${error}`);

        return null;
      }

      logger.info('SUCCESS :: GRAPHQL:  Inciando creación de usuario Lintellect');

      return hashGenerator(input.password, 10, cryptoPassword => {
        const user = new User({
          email: input.email,
          name: input.name,
          password: cryptoPassword,
          avatar: getGravatar(input.email)
        });

        user.save(function (error, userStored) {
          if (error) {
            logger.warn(`ERROR :: GRAPHQL:Error al guardar el usario en la base de datos 
                  Usuario: ${input.email}
                  Error: ${error}`);

            return null;
          }

          const token = createToken(user);

          return {
            user: {
              id: userStored._id,
              name: userStored.name,
              avatar: userStored.avatar,
              email: userStored.email
            },
            token
          };
        });
      }, e => {
        logger.info(`ERROR :: GRAPHQL: /signup ${error}`);
        return null;
      });
    }
  }
});
