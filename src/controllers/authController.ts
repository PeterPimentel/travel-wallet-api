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

export const activationRetry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await authService.activationRetry(id);
    res.json(response);
  } catch (error: any) {
    logger.error(NAME_SPACE, error)
    next(error);
  }
};

export const signupConfirm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const callbackURL = req.query.callbackURL;
    const result = await authService.signupConfirm(req.params.token);

    res.status(301).redirect(`${callbackURL}?status=${result.status}&code=${result.code}`)
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

export const passwordResetRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.passwordResetRequest(req.body.email);
    res.status(204).send();
  } catch (error: any) {
    logger.error(NAME_SPACE, error)
    next(error);
  }
};

export const passwordUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.passwordUpdate(req.body.email, req.body.code, req.body.password);
    res.status(204).send();
  } catch (error: any) {
    logger.error(NAME_SPACE, error)
    next(error);
  }
};