import * as gigsValidation from '../../src/api/validations/gigs.validation';

declare global {
  namespace Express {
    interface Request {
      body: gigsValidation.createGigValidationRequest;
    }
  }
}
