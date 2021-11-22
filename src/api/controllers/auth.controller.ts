import * as express from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import httpStatus from 'http-status';
import {
  nonceValidationRequestSchema,
  authenticateValidationRequestSchema,
  refreshTokensValidationRequestSchema,
} from '../validations/auth.validation';
import { createUser, getUserByAddress } from '../services/user.service';
import { checkSignature, refreshAuth } from '../services/auth.service';
import { generateAuthTokens } from '../services/token.service';
import { randomNonce } from '../utils/randomNonce';
import { catchAsync } from '../utils/catchAsync';

export const nonceController = catchAsync(
  async (req: ValidatedRequest<nonceValidationRequestSchema>, res: express.Response) => {
    const { address } = req.body;
    let user = await getUserByAddress(address, true);
    // if user do not exist create user and return httpStatus.CREATED with newly created nonce from db
    if (!user) {
      user = await createUser(req.body);
      res.status(httpStatus.CREATED).send({ user });
      // if user exists return httpStatus.OK with nonce from db
    } else {
      user.nonce = randomNonce();
      user.save();
      res.send({ user });
    }
  },
);

export const authenticateController = catchAsync(
  async (req: ValidatedRequest<authenticateValidationRequestSchema>, res: express.Response) => {
    const { address, signature } = req.body;
    const user = await getUserByAddress(address);
    const valid = checkSignature(address, signature, user.nonce.toString());

    // If signature not valid, unauthorized
    if (!valid) {
      res.status(httpStatus.BAD_REQUEST).send('Sorry, signature do not match.');
      // If signature valid, log in and send jwt
    } else {
      const tokens = await generateAuthTokens(user);
      res.send(tokens);
    }
  },
);

export const refreshTokensController = catchAsync(
  async (req: ValidatedRequest<refreshTokensValidationRequestSchema>, res: express.Response) => {
    const tokens = await refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  },
);
