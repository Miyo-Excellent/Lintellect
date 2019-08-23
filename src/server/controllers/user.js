//  Dependencies

//  Models
import {User} from '../models';

//  Services
import {createToken} from '../services';

export async function signIn(req, res) {
  const email = req.body.email || req.query.email;

  await User.find({email}, function (error, user) {
    if (error) {
      return res.status(500).send({message: error});
    }

    if (!user[0]) {
      return res.status(404).send({message: 'El usuario no existe'});
    }

    req.user = user;

    return res.status(200).send({
      message: 'Te has logeado correctamente',
      token: createToken(user)
    });
  });
}

export async function signInWithGoogle(req, res, next) {
  const email = req.body.email || req.query.email;

  await User.find({email}, function (error, user) {
    if (error) {
      return res.status(500).send({message: error});
    }

    if (!user[0]) {
      return signUp(req, res, next);
    }

    req.user = user;

    return res.status(200).send({
      message: 'Te has logeado correctamente',
      token: createToken(user)
    });
  });
}

export async function signUp(req, res) {
  const email = req.body.email || req.query.email;
  const name = req.body.name || req.query.name;

  const user = new User({email, name});

  await user.save(function (error, userStored) {
    if (error) {
      return res.status(500).send({message: `Error al guardar el usario en la base de datos ${error}`});
    }

    if (!userStored) {
      return res.status(404).send({message: 'El usuario no existe'});
    }

    const token = createToken(user);

    res.status(200).send({token});
  });
}
