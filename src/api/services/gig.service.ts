import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { Schema } from 'mongoose';
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

export const updateGigService = async (
  id: Schema.Types.ObjectId,
  update: gigsValidation.updateGigValidationRequest,
): Promise<IGig> => {
  try {
    return await Gig.findByIdAndUpdate(id, update);
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

export const getGigService = async (id: Schema.Types.ObjectId): Promise<IGig> => {
  try {
    return await Gig.findById(id);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};
