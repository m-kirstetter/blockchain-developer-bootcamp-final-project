import { Application } from 'express';
import { createValidator } from 'express-joi-validation';
import { createGigValidation, updateGigValidation, getGigsValidation } from '../validations/gigs.validation';
import { createGig, updateGig, getGigs } from '../controllers/gigs.controller';
import auth from '../middlewares/auth';

const validator = createValidator();

export const GigsRoutes = (app: Application) => {
  app.post('/gigs', [auth(), validator.body(createGigValidation.body)], createGig);
  app.patch('/gigs/:gigId', [auth(), validator.body(updateGigValidation.body)], updateGig);
  app.get('/gigs', [auth(), validator.query(getGigsValidation.query)], getGigs);
};
