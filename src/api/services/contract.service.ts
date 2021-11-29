import { Schema } from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Contract, IContract } from '../models/contract.model';
import * as contractsValidation from '../validations/contracts.validation';
import { Gig } from '../models/gig.model';

export const createContractService = async (
  contractBody: contractsValidation.createContractValidationRequest,
): Promise<IContract> => {
  try {
    const contract = await Contract.create(contractBody);

    const gig = await Gig.findById(contractBody.gig);
    gig.contract = contract._id;
    gig.save();

    return contract;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

export const updateContractService = async (
  id: Schema.Types.ObjectId,
  update: contractsValidation.updateContractValidationRequest,
): Promise<IContract> => {
  try {
    return await Contract.findByIdAndUpdate(id, update);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

export const getContractService = async (id: Schema.Types.ObjectId): Promise<IContract> => {
  try {
    return await Contract.findById(id).exec();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};
