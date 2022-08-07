import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')!;
  if(!token) return res.status(401).json({ error: 'Login Required' });
  const secret = process.env.JWT_SECRET!;

  try {
    const decoded = jwt.verify(token, secret) as { _id: string };
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        error: 'Login required',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

export { isAuthenticated };
