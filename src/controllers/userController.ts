import { Request, Response, NextFunction } from 'express';

import * as userService from '../services/userService';
import { AuthRequest } from '../types/RequestType';
import logger from '../util/logUtil';

const NAME_SPACE = "user-controller";


export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await userService.remove(id);
    res.json(response);
  } catch (error: any) {
    logger.error(NAME_SPACE, error)
    next(error);
  }
};

