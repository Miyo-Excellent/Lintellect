//  Dependencies
import jwt from 'jwt-simple';
import moment from 'moment';

//  Server Configuration
import serverConfig from '../config';

export default function createToken(user) {
  const payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add({days: 8}).unix()
  };

  return jwt.encode(payload, serverConfig.SECRET_TOKEN);
}
