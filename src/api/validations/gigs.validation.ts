import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { IStatuses } from '@/interfaces/IStatuses';
import { IGig } from '@/api/models/gig.model';

export const createGigValidation = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    details: Joi.string().required(),
    skills: Joi.string().required(),
    budget: Joi.object().keys({
      min: Joi.number().required(),
      max: Joi.number().required(),
    }),
  }),
};

export type createGigValidationRequest = Omit<IGig, 'status' | 'freelancer' | 'deadline'>;

export interface createGigValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<createGigValidationRequest, 'owner'>;
}

export const getGigsValidation = {
  query: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    details: Joi.string(),
    skills: Joi.string(),
    status: Joi.string(),
    budget: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export interface getGigsValidationRequest extends IPaginationQueryOptions {
  status: IStatuses;
  budget: number;
}

export interface getGigsValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: getGigsValidationRequest;
}
