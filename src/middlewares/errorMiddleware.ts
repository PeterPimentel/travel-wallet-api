import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../util/Error';
import { ERROR_MESSAGES, getPrismaErrorMessage } from '../util/errorUtil';

interface ExpressError {
  status: number;
}

export const handleJSONParse = (err: ExpressError, _: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const error = new ApiError(ERROR_MESSAGES.JSON_ERROR, 400);
    return res.status(error.statusCode).send(JSON.stringify(error, null, 4));
  }
  return next();
};

export const errorResponder = (err: any, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).send(JSON.stringify(err, null, 4));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).send(JSON.stringify(new ApiError(getPrismaErrorMessage(err.code), 500), null, 4));
  } else {
    res.status(500).send(JSON.stringify(new ApiError(ERROR_MESSAGES.UNEXPECTED_ERROR, 500), null, 4));
  }
};
