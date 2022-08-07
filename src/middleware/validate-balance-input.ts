import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { transform } from '../utils/transform-message';

const balanceSchema = Joi.object({
  accountNumber: Joi.string().required().custom((val) => {
    if(val.length != 10) return false;
  }),
  amount: Joi.number().required(),
});

const validateBalanceInput = (req: Request, res: Response, next: NextFunction) => {
  const result = balanceSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      error: transform(result.error.details[0].message),
    });
  }

  next();
}

export {
  validateBalanceInput
}