import * as express from 'express';
import { pick } from 'lodash';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { IGig } from '../models/gig.model';
import { createGigService, queryGigsService } from '../services/gig.service';
import { verifyToken } from '../services/token.service';
import { catchAsync } from '../utils/catchAsync';
import { TokenTypes } from '../enums/TokenTypes';
import * as gigsValidation from '../validations/gigs.validation';

export const createGig = catchAsync(
  async (req: gigsValidation.createGigValidationRequestSchema, res: express.Response) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    const tokenDoc = await verifyToken(token, TokenTypes.ACCESS);
    const gigBody = req.body as gigsValidation.createGigValidationRequest;

    gigBody.owner = tokenDoc.user;

    const gig = await createGigService(gigBody);
    res.send({ gig });
  },
);

export const getGigs = catchAsync(async (req: express.Request, res: express.Response) => {
  const filter = (pick(req.query, ['status', 'createdAt', 'owner']) as unknown) as Partial<IGig>;
  const options = (pick(req.query, ['sortBy', 'limit', 'page']) as unknown) as Partial<IPaginationQueryOptions>;
  const gigs = await queryGigsService(filter, options);
  res.send({ gigs });
});
