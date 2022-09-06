import { NextFunction, Request, Response } from 'express';

import * as cmsService from '../services/cmsService';

export const landingPage = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const response = await cmsService.landingPage();
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};
