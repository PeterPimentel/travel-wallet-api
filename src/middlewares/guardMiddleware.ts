import { NextFunction, Response, Request } from 'express';

import { AuthRequest } from '../types/RequestType';
import { RoleAccessType } from '../types/CommonType';

import { validateToken } from '../services/cryptService';

import { AuthError } from '../util/Error';
import { ERROR_MESSAGES, ERROR_CODES } from '../util/errorUtil';
import { hasRoleAccess } from '../util/validator/roleValidator';

export const authGuard = (role: RoleAccessType) => async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await validateToken(req.headers.authorization);

    if (user) {
      if (!hasRoleAccess(role, user.role)) {
        throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 401, ERROR_CODES.forbidden);
      }

      (req as unknown as AuthRequest).user = user;
      next();
    } else {
      throw new AuthError(ERROR_MESSAGES.NO_TOKEN, 401);
    }
  } catch (error: any) {
    switch (error.name) {
      case 'TokenExpiredError':
        return next(new AuthError(ERROR_MESSAGES.EXPIRED_TOKEN, 401));
      case 'JsonWebTokenError':
        return next(new AuthError(ERROR_MESSAGES.TOKEN_ERROR, 403));
      default:
        return next(error);
    }
  }
};


export const activationGuard = async (req: Request, _: Response, next: NextFunction) => {
  const user = (req as unknown as AuthRequest).user;

  if (user && user.active) {
    return next();
  } else {
    return next(new AuthError(ERROR_MESSAGES.ACCOUNT_NOT_ACTIVATED, 403, ERROR_CODES.account_not_activated))
  }
};