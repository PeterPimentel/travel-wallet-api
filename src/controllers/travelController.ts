import { NextFunction, Request, Response } from 'express';

import { AuthRequest } from '../types/RequestType';

import * as travelService from '../services/travelService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await travelService.create(id, req.body);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await travelService.find(id);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await travelService.findOne(id, Number(req.params.id));
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await travelService.update(id, Number(req.params.id), req.body);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as unknown as AuthRequest).user.id;
    const response = await travelService.remove(id, Number(req.params.id));
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};
