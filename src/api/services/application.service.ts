import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { Schema } from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Application, IApplication, IApplicationsQueryResult } from '../models/application.model';
import * as applicationsValidation from '../validations/applications.validation';
import { Gig } from '../models/gig.model';

export const createApplicationService = async (
  applicationBody: applicationsValidation.createApplicationValidationRequest,
): Promise<IApplication> => {
  try {
    const application = await Application.create(applicationBody);

    const gig = await Gig.findById(applicationBody.gig);
    gig.applications.push(application._id);
    gig.save();

    return application;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

export const updateApplicationService = async (
  id: Schema.Types.ObjectId,
  update: applicationsValidation.updateApplicationValidationRequest,
): Promise<IApplication> => {
  try {
    return await Application.findByIdAndUpdate(id, update);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

export const queryApplicationsService = async (
  filter: Partial<Omit<IApplication, '_id' | 'why' | 'milestones' | 'amount'>>,
  options: Partial<IPaginationQueryOptions>,
): Promise<IApplicationsQueryResult> => {
  try {
    return await Application.paginate(filter, options);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

export const getApplicationService = async (id: Schema.Types.ObjectId): Promise<IApplication> => {
  try {
    return await Application.findById(id);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};
