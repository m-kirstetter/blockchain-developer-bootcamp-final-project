import { Application } from 'express';
import { createValidator } from 'express-joi-validation';
import { nonceValidation, authenticateValidation, refreshTokensValidation } from '../validations/auth.validation';
import { nonceController, authenticateController, refreshTokensController } from '../controllers/auth.controller';

const validator = createValidator();

export const AuthRoutes = (app: Application) => {
  app.post('/auth/nonce', validator.body(nonceValidation.body), nonceController);
  app.post('/auth/authenticate', validator.body(authenticateValidation.body), authenticateController);
  app.post('/auth/refresh', validator.body(refreshTokensValidation.body), refreshTokensController);
};
