import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { transform } from '../utils/transform-message';

const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(7).alphanum().required(),
});

const validateUserRegistration = (req: Request, res: Response, next: NextFunction) => {
  const result = registerSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      error: transform(result.error.details[0].message),
    });
  }

  next();
}

export {
  validateUserRegistration
}