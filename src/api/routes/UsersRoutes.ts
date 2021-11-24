import { Application } from 'express';
import { createValidator } from 'express-joi-validation';
import auth from '../middlewares/auth';
import * as usersValidation from '../validations/users.validation';
import * as usersController from '../controllers/users.controller';

const validator = createValidator();

export const UsersRoutes = (app: Application) => {
  app.get('/users/me', [auth(), validator.query(usersValidation.me.query)], usersController.me);
  app.patch('/users/me', [auth(), validator.query(usersValidation.meUpdate.body)], usersController.meUpdate);
};
