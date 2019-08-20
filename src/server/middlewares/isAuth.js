//  Services
import {decodeToken} from '../services';

export default async function isAuth(req, res, next) {
  const {authorization} = req.headers;

  if (!authorization) return res.redirect( '/login', 403, 'No tienes autorización');

  const token = authorization.split(' ')[1];

  decodeToken(token).then(response => {
    req.user = response;
    next();
  }).catch(error => {
    res.redirect( '/login', error.status, error.message);
  });
}
