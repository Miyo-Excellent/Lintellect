//  Dependencies
import Joi from '@hapi/joi';

//  Schema
const schema = key => {
  switch (key) {
    case 'user_sign_in': return Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    });

    case 'user_sign_in_with_google': return Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      name: Joi.string().min(8).required()
    });

    case 'user_sign_up': return Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      name: Joi.string().min(8).required()
    });

    case 'add_product': return Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().min(10).required(),
      category: Joi.string().regex(/(computers|phones|accesories)/).required()
    });

    default: return null;
  }
};

//  Validations
export default ({options, key}) => Joi.validate(options, schema(key));
