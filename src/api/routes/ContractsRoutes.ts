import { Application } from 'express';
import { createValidator } from 'express-joi-validation';
import { createContractValidation } from '../validations/contracts.validation';
import { createContract } from '../controllers/contracts.controller';
import auth from '../middlewares/auth';

const validator = createValidator();

export const ContractsRoutes = (app: Application) => {
  app.post('/contracts', [auth(), validator.body(createContractValidation.body)], createContract);
};
