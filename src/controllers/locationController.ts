import { NextFunction, Request, Response } from 'express';

import * as locationService from '../services/locationService';

export const findPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await locationService.getPlaces(req.body);
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};
