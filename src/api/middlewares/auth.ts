import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import { IUser } from '../models/user.model';
import ApiError from '../utils/ApiError';
import { allRoles } from '../config/roles';
import { RolesRights } from '../enums/Roles';

const verifyCallback = (req: Request, resolve: any, reject: any, requiredRights: RolesRights[]) => (
  err: any,
  user: IUser,
  info: any,
) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = allRoles[user.role];
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights: RolesRights[]) => (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
      req,
      res,
      next,
    );
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
