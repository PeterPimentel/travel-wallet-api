import { Request, Response, NextFunction } from 'express';

import * as authService from '../services/authService';
import { AuthRequest } from '../types/RequestType';
import logger from '../util/logUtil';

const NAME_SPACE = "auth-controller";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await authService.signup(req.body);
    res.json(response);
  } catch (error: any) {
     logger.error(NAME_SPACE, error)
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await authService.signin(req.body.email, req.body.password);
    res.json(response);
  } catch (error: any) {
    logger.error(NAME_SPACE, error)
    next(error);
  }
};

export const session = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as unknown as AuthRequest).user;
    res.json({ user });
  } catch (error: any) {
    next(error);
  }
};
