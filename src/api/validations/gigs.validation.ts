import Joi from 'joi';
import { Schema } from 'mongoose';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
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
    status: Joi.array(),
    owner: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export interface getGigsValidationRequest extends IPaginationQueryOptions {
  owner: Schema.Types.ObjectId;
  sortBy: string;
  limit: number;
  page: number;
}

export interface getGigsValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: getGigsValidationRequest;
}

export const updateGigValidation = {
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    details: Joi.string(),
    skills: Joi.string(),
    status: Joi.string().valid('Draft', 'Open', 'Running', 'Closed'),
    budget: Joi.object().keys({
      min: Joi.number().required(),
      max: Joi.number().required(),
    }),
    freelancer: Joi.string(),
    deadline: Joi.string(),
  }),
};

export type updateGigValidationRequest = Partial<IGig>;

export interface updateGigValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<updateGigValidationRequest, 'owner'>;
}
