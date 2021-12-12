import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { IContract } from '@/api/models/contract.model';

export const createContractValidation = {
  body: Joi.object().keys({
    client: Joi.string().required(),
    provider: Joi.string().required(),
    contract: Joi.string(),
    gig: Joi.string().required(),
    application: Joi.string().required(),
  }),
};

export type createContractValidationRequest = IContract;

export interface createContractValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: createContractValidationRequest;
}

export const updateContractValidation = {
  body: Joi.object().keys({
    contract: Joi.string(),
    paid: Joi.bool(),
  }),
};

export type updateContractValidationRequest = Partial<IContract>;

export interface updateContractValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<
    updateContractValidationRequest,
    'client' | 'provider' | 'contract' | 'gig' | 'application'
  >;
}
