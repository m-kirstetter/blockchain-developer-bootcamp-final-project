import { Application } from 'express';
import { createValidator } from 'express-joi-validation';
import {
  createApplicationValidation,
  updateApplicationValidation,
  getApplicationsValidation,
} from '../validations/applications.validation';
import { createApplication, updateApplication, getApplications } from '../controllers/applications.controller';
import auth from '../middlewares/auth';

const validator = createValidator();

export const ApplicationsRoutes = (app: Application) => {
  app.post('/applications', [auth(), validator.body(createApplicationValidation.body)], createApplication);
  app.patch(
    '/applications/:applicationId',
    [auth(), validator.body(updateApplicationValidation.body)],
    updateApplication,
  );
  app.get('/applications', [auth(), validator.query(getApplicationsValidation.query)], getApplications);
};
