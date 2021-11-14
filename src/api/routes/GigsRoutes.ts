import { Application } from 'express';
import { createValidator } from 'express-joi-validation';
import { createGigValidation, getGigsValidation } from '../validations/gigs.validation';
import { createGig, getGigs } from '../controllers/gigs.controller';
import auth from '../middlewares/auth';

const validator = createValidator();

export const GigsRoutes = (app: Application) => {
  app.post('/gigs', [auth(), validator.body(createGigValidation.body)], createGig);
  app.get('/gigs', [auth(), validator.query(getGigsValidation.query)], getGigs);
};
