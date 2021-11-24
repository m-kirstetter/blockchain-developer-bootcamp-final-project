import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const nonceValidation = {
  body: Joi.object().keys({
    address: Joi.string().required(),
  }),
};

export interface nonceValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    address: string;
  };
}

export const authenticateValidation = {
  body: Joi.object().keys({
    address: Joi.string().required(),
    signature: Joi.string().required(),
  }),
};

export interface authenticateValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    address: string;
    signature: string;
  };
}

export const refreshTokensValidation = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export interface refreshTokensValidationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    refreshToken: string;
  };
}
