import { NextFunction, Request, Response } from 'express';

import * as coverService from '../services/coverService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await coverService.create(req.body);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await coverService.update(Number(req.params.id), req.body);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await coverService.remove(Number(req.params.id));
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const findAll = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const response = await coverService.findAll();
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};
