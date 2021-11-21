import Joi from 'joi';
import { Schema } from 'mongoose';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { IApplicationStatuses } from '@/interfaces/IStatuses';
import { IApplication } from '@/api/models/application.model';

export const createApplicationValidation = {
  body: Joi.object().keys({
    why: Joi.string().required(),
    gig: Joi.string().required(),
    amount: Joi.number().required(),
    milestones: Joi.array().items({
      order: Joi.number().required(),
      title: Joi.string().required(),
      amount: Joi.number().required(),
    }),
  }),
};

export type createApplicationValidationRequest = Omit<IApplication, 'status'>;

export interface createApplicationValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<createApplicationValidationRequest, 'owner'>;
}

export const getApplicationsValidation = {
  query: Joi.object().keys({
    status: Joi.array(),
    owner: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export interface getApplicationsValidationRequest extends IPaginationQueryOptions {
  status: IApplicationStatuses[];
  owner: Schema.Types.ObjectId;
  sortBy: string;
  limit: number;
  page: number;
}

export interface getApplicationsValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: getApplicationsValidationRequest;
}

export const updateApplicationValidation = {
  body: Joi.object().keys({
    status: Joi.string(),
  }),
};

export type updateApplicationValidationRequest = Partial<IApplication>;

export interface updateApplicationValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<updateApplicationValidationRequest, 'owner' | 'why' | 'milestones'>;
}
