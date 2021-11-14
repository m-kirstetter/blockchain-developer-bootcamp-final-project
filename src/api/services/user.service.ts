import { Schema } from 'mongoose';
import httpStatus from 'http-status';
import { User, ICreateUserRequest } from '../models/user.model';
import ApiError from '../utils/ApiError';
import { randomNonce } from '../utils/randomNonce';
import * as usersValidation from '../validations/users.validation';

/**
 * Create a user
 * @param {Object} user
 * @returns {Promise<User>}
 */
export const createUser = async (user: ICreateUserRequest): Promise<InstanceType<typeof User>> => {
  if (await User.isAddressTaken(user.address)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Address already taken');
  }
  user.nonce = randomNonce();
  return await User.create(user);
};

/**
 * Get user by address
 * @param {string} address
 * @returns {Promise<User>}
 */
export const getUserByAddress = async (address: string, noError = false): Promise<InstanceType<typeof User>> => {
  const user = await User.findOne({ address });
  if (!user && !noError) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
export const getUserById = async (id: Schema.Types.ObjectId): Promise<InstanceType<typeof User>> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
export const updateUserById = async (
  id: Schema.Types.ObjectId,
  updateBody: usersValidation.userUpdateRequestSchema,
): Promise<InstanceType<typeof User>> => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};
