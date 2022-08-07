import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).alphanum().required(),
});

const validateUserSignIn = (req: Request, res: Response, next: NextFunction) => {
  const result = signInSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      error: result.error.details[0].message,
    });
  }

  next();
}

export {
  validateUserSignIn
}