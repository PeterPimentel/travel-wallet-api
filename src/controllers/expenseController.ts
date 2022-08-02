import { NextFunction, Request, Response } from 'express';

import { AuthRequest } from '../types/RequestType';

import * as expenseService from '../services/expenseService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as unknown as AuthRequest).user.id;
    const response = await expenseService.create(userId, req.body);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as unknown as AuthRequest).user.id;
    const response = await expenseService.update(userId, Number(req.params.id), req.body);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as unknown as AuthRequest).user.id;
    const response = await expenseService.remove(userId, Number(req.params.id));
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};
