//  Dependencies
import jwt from 'jwt-simple';
import moment from 'moment';

//  Server Configuration
import serverConfig from '../config';

export default async function decodeToken(token) {
  return new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, serverConfig.SECRET_TOKEN);

      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'El token ha expirado'
        });
      }

      resolve(payload.sub);
    } catch (error) {
      reject({
        status: 500,
        message: 'Invalid token'
      });
    }
  });
}
