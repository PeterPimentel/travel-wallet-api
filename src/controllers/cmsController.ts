import { NextFunction, Request, Response } from 'express';

import * as cmsService from '../services/cmsService';

export const landingPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = req.query.locale as string;
    const response = await cmsService.landingPage(locale || 'en');
    res.json(response);
  } catch (error: any) {
    next(error);
  }
};
