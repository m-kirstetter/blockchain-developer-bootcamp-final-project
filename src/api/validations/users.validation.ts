import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const me = {
  query: Joi.object().keys({}),
};

export interface meRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Record<string, never>;
}

export const meUpdate = {
  body: Joi.object().keys({
    firstname: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid('FREELANCER', 'RECRUITER'),
    bio: Joi.string(),
    linkedin: Joi.string(),
  }),
};

export interface userUpdateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    firstname?: string;
    lastname?: string;
    fullname?: string;
    email?: string;
    role?: string;
    bio?: string;
    linkedin?: string;
  };
}
