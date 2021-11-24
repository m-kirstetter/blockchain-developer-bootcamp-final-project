import { Application } from 'express';
import { createValidator } from 'express-joi-validation';
import { createApplicationValidation, getApplicationsValidation } from '../validations/applications.validation';
import { createApplication, getApplications } from '../controllers/applications.controller';
import auth from '../middlewares/auth';

const validator = createValidator();

export const ApplicationsRoutes = (app: Application) => {
  app.post('/applications', [auth(), validator.body(createApplicationValidation.body)], createApplication);
  app.get('/applications', [auth(), validator.query(getApplicationsValidation.query)], getApplications);
};
