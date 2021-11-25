import * as express from 'express';
import httpStatus from 'http-status';
import { isModel } from '../../utils/typeguards';
import ApiError from '../utils/ApiError';
import { createContractService } from '../services/contract.service';
import { verifyToken } from '../services/token.service';
import { getUserById } from '../services/user.service';
import { getGigService } from '../services/gig.service';
import { catchAsync } from '../utils/catchAsync';
import { TokenTypes } from '../enums/TokenTypes';
import * as contractsValidation from '../validations/contracts.validation';
import { IUser } from '../models/user.model';
import { IGig } from '../models/gig.model';

export const createContract = catchAsync(
  async (req: contractsValidation.createContractValidationRequestSchema, res: express.Response) => {
    const contractBody = req.body as contractsValidation.createContractValidationRequest;
    if (isModel<IGig>(contractBody.gig)) throw new Error('Error, gig must be ObjectId');
    const gig = await getGigService(contractBody.gig);
    if (!isModel<IUser>(gig.owner)) throw new Error('Error, owner must be Model');

    const token = req.headers.authorization.replace('Bearer ', '');
    const tokenDoc = await verifyToken(token, TokenTypes.ACCESS);

    const user = await getUserById(tokenDoc.user);

    if (
      user.role !== 'RECRUITER' ||
      contractBody.client !== gig.owner._id.toString() ||
      contractBody.client !== user._id.toString() ||
      user._id.toString() !== gig.owner._id.toString() ||
      gig.contract
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are not allowed to create this Contract');
    }

    const contract = await createContractService(contractBody);
    res.send({ contract });
  },
);
