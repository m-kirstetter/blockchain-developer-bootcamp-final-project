import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { Schema } from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Gig, IGig, IGigsQueryResult } from '../models/gig.model';
import * as gigsValidation from '../validations/gigs.validation';

export const createGigService = async (gigBody: gigsValidation.createGigValidationRequest): Promise<IGig> => {
  try {
    let gig = await Gig.create(gigBody);

    gig = await gig.populate({
      path: 'owner',
      select: 'address bio linkedin role',
    });

    gig = await gig.populate({
      path: 'applications',
      select: 'name bio linkedin role',
      populate: {
        path: 'owner',
        select: 'address bio linkedin role',
      },
    });

    return gig;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

export const updateGigService = async (
  id: Schema.Types.ObjectId,
  update: gigsValidation.updateGigValidationRequest,
): Promise<IGig> => {
  try {
    let gig = await Gig.findByIdAndUpdate(id, update);

    gig = await gig.populate({
      path: 'owner',
      select: 'address bio linkedin role',
    });

    gig = await gig.populate({
      path: 'applications',
      select: 'name bio linkedin role',
      populate: {
        path: 'owner',
        select: 'address bio linkedin role',
      },
    });

    return gig;
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
    let gig = await Gig.findById(id);

    gig = await gig.populate({
      path: 'owner',
      select: 'address bio linkedin role',
    });

    gig = await gig.populate({
      path: 'applications',
      select: 'name bio linkedin role',
      populate: {
        path: 'owner',
        select: 'address bio linkedin role',
      },
    });

    return gig;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};
