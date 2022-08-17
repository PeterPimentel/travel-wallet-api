import { Request, Response } from 'express';

export const status = async (_: Request, res: Response) => {
  res.json({
        "status": "All systems operational",
        "status_color": "green"
    });
};