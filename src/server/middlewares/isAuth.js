//  Services
import {decodeToken} from '../services';
import logger from '../logger';

export default function isAuth(req, res, next) {
  //  const {authorization} = req.headers;
  const {token} = req.session;

  debugger;

  //  if (!authorization) {
  if (!token) {
    logger.error(`AUTHORIZATION:[IP: ${req.ip}] No tienes autorización`);
    console.error(`AUTHORIZATION:[IP: ${req.ip}] No tienes autorización`);

    return res.redirect( '/login', 403, 'No tienes autorización');
  }

  decodeToken(token).then(response => {
    return next();
  }).catch(error => {
    logger.error(`AUTHORIZATION:[IP: ${req.ip}] Error al decodificar TOKEN
    Error: ${error.message}`);

    console.error(`AUTHORIZATION:[IP: ${req.ip}] Error al decodificar TOKEN
    Error: ${error.message}`);

    return res.redirect( '/login', error.status, error.message);
  });
}
