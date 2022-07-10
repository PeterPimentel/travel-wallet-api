import { NextFunction, Response, Request } from 'express';

import { validateToken } from '../services/cryptService';

import { AuthError } from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';
import { AuthRequest } from '../types/RequestType';

type RouteAccessType = 'ADMIN' | 'USER' | 'ALL';

export const authGuard = (_: RouteAccessType) => async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await validateToken(req.headers.authorization);

    if (user) {
      (req as unknown as AuthRequest).user = user;
      next();
    } else {
      throw new AuthError(ERROR_MESSAGES.NO_TOKEN, 401);
    }
  } catch (error: any) {
    switch (error.name) {
      case 'TokenExpiredError':
        return next(new AuthError(ERROR_MESSAGES.EXPIRED_TOKEN, 401, error));
      case 'JsonWebTokenError':
        return next(new AuthError(ERROR_MESSAGES.TOKEN_ERROR, 403, error));
      default:
        return next(error);
    }
  }
};
