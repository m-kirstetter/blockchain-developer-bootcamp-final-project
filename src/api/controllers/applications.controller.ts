import * as express from 'express';
import { pick } from 'lodash';
import httpStatus from 'http-status';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { Schema } from 'mongoose';
import { isModel } from '../../utils/typeguards';
import ApiError from '../utils/ApiError';
import { IApplication } from '../models/application.model';
import {
  createApplicationService,
  getApplicationService,
  queryApplicationsService,
  updateApplicationService,
} from '../services/application.service';
import { verifyToken } from '../services/token.service';
import { getUserById } from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';
import { TokenTypes } from '../enums/TokenTypes';
import * as applicationsValidation from '../validations/applications.validation';
import { IGig } from '../models/gig.model';
import { getGigService } from '../services/gig.service';
import { IUser } from '../models/user.model';

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

export const updateApplication = catchAsync(
  async (req: applicationsValidation.updateApplicationValidationRequestSchema, res: express.Response) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    const tokenDoc = await verifyToken(token, TokenTypes.ACCESS);
    const applicationBody = req.body as applicationsValidation.updateApplicationValidationRequest;

    const applicationId = req.params.applicationId;

    const application = await getApplicationService(applicationId);
    const gig = await getGigService((application.gig as unknown) as Schema.Types.ObjectId);

    if (!isModel<IUser>(gig.owner)) throw new Error('Error, user must be Model');
    if (!isModel<IGig>(application.gig)) throw new Error('Error, gig must be Model');
    if (gig.owner._id.toString() !== tokenDoc.user.toString()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are not allowed to modify this Contract');
    }

    const updatedGig = await updateApplicationService(applicationId, applicationBody);

    res.send({ updatedGig });
  },
);

export const getApplications = catchAsync(async (req: express.Request, res: express.Response) => {
  const filter = (pick(req.query, ['status', 'owner', 'gig', 'amount']) as unknown) as Partial<IApplication>;
  const options = (pick(req.query, ['sortBy', 'limit', 'page']) as unknown) as Partial<IPaginationQueryOptions>;
  const applications = await queryApplicationsService(filter, options);
  res.send({ applications });
});
