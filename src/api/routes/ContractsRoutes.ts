import { Application } from 'express';
import { createValidator } from 'express-joi-validation';
import { createContractValidation, updateContractValidation } from '../validations/contracts.validation';
import { createContract, updateContract } from '../controllers/contracts.controller';
import auth from '../middlewares/auth';

const validator = createValidator();

export const ContractsRoutes = (app: Application) => {
  app.post('/contracts', [auth(), validator.body(createContractValidation.body)], createContract);
  app.patch('/contracts/:contractId', [auth(), validator.body(updateContractValidation.body)], updateContract);
};
