import * as express from 'express';

export const catchAsync = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
