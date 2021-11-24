import * as express from 'express';
import { ValidatedRequest } from 'express-joi-validation';
// import httpStatus from 'http-status';
import * as usersValidation from '../validations/users.validation';
import { getUserById, updateUserById } from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';
import { verifyToken } from '../services/token.service';
import { TokenTypes } from '../enums/TokenTypes';
// import ApiError from '../utils/ApiError';

export const me = catchAsync(async (req: ValidatedRequest<usersValidation.meRequestSchema>, res: express.Response) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const tokenDoc = await verifyToken(token, TokenTypes.ACCESS);
  const user = await getUserById(tokenDoc.user);
  res.send({ user });
});

export const meUpdate = catchAsync(async (req: express.Request, res: express.Response) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const tokenDoc = await verifyToken(token, TokenTypes.ACCESS);
  const user = await updateUserById(tokenDoc.user, req.body);
  res.send({ user });
});
