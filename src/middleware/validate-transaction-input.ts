import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { transform } from '../utils/transform-message';

const transactionSchema = Joi.object({
  amount: Joi.number().required(),
  transferDescription: Joi.string().required(),
  senderAccount: Joi.string().required().custom((val) => {
    if(val.length != 10) return false;
  }),
  recieverAccount: Joi.string().required().custom((val) => {
    if(val.length != 10) return false;
  }),
});

const validateTransactionInput = (req: Request, res: Response, next: NextFunction) => {
  const result = transactionSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      error: transform(result.error.details[0].message),
    });
  }

  next();
}

export {
  validateTransactionInput
}