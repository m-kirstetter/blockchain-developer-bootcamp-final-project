import * as express from 'express';
import { pick } from 'lodash';
import httpStatus from 'http-status';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import ApiError from '../utils/ApiError';
import { IApplication } from '../models/application.model';
import { createApplicationService, queryApplicationsService } from '../services/application.service';
import { verifyToken } from '../services/token.service';
import { getUserById } from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';
import { TokenTypes } from '../enums/TokenTypes';
import * as applicationsValidation from '../validations/applications.validation';

export const createApplication = catchAsync(
  async (req: applicationsValidation.createApplicationValidationRequestSchema, res: express.Response) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    const tokenDoc = await verifyToken(token, TokenTypes.ACCESS);
    const applicationBody = req.body as applicationsValidation.createApplicationValidationRequest;

    const user = await getUserById(tokenDoc.user);

    if (user.role !== 'FREELANCER') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are not allowed to post Applications');
    }

    applicationBody.owner = tokenDoc.user;

    const application = await createApplicationService(applicationBody);
    res.send({ application });
  },
);

export const getApplications = catchAsync(async (req: express.Request, res: express.Response) => {
  const filter = (pick(req.query, ['status', 'owner', 'gig', 'amount']) as unknown) as Partial<IApplication>;
  const options = (pick(req.query, ['sortBy', 'limit', 'page']) as unknown) as Partial<IPaginationQueryOptions>;
  const applications = await queryApplicationsService(filter, options);
  res.send({ applications });
});
