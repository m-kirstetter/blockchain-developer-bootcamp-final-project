import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Gig, IGig, IGigsQueryResult } from '../models/gig.model';
import * as gigsValidation from '../validations/gigs.validation';

export const createGigService = async (gigBody: gigsValidation.createGigValidationRequest): Promise<IGig> => {
  try {
    return await Gig.create(gigBody);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

export const queryGigsService = async (
  filter: Partial<Omit<IGig, '_id' | 'title' | 'description' | 'skills' | 'details'>>,
  options: Partial<IPaginationQueryOptions>,
): Promise<IGigsQueryResult> => {
  try {
    return await Gig.paginate(filter, options);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};
