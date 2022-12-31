import { NextFunction, Request, Response } from 'express';

import { AuthRequest } from '../types/RequestType';

import * as sharedTravelService from '../services/sharedTravelService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await sharedTravelService.create(id, req.body);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await sharedTravelService.find(id);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const findUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await sharedTravelService.findUsers(id, Number(req.params.travelId));
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await sharedTravelService.remove(id, Number(req.params.id));
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

