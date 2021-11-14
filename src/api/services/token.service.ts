import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import { Schema } from 'mongoose';
import ApiError from '../utils/ApiError';
import { IToken, Token, ITokensResponse } from '../models/token.model';
import { IUser } from '../models/user.model';
import { TokenTypes } from '../enums/TokenTypes';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId: Schema.Types.ObjectId,
  expires: any,
  type: string,
  secret: string = process.env.NUXT_ENV_JWT_SECRET,
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
export const saveToken = async (
  token: string,
  userId: Schema.Types.ObjectId,
  expires: any,
  type: TokenTypes,
  blacklisted = false,
): Promise<InstanceType<typeof Token>> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token: IToken['token'], type: TokenTypes): Promise<InstanceType<typeof Token>> => {
  const payload = jwt.verify(token, process.env.NUXT_ENV_JWT_SECRET);
  const user: Schema.Types.ObjectId = (payload.sub as unknown) as Schema.Types.ObjectId;
  const tokenDoc = await Token.findOne({ token, type, user, blacklisted: false });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (user: IUser): Promise<ITokensResponse> => {
  const accessTokenExpires = moment().add(process.env.NUXT_ENV_JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, TokenTypes.ACCESS);
  await saveToken(accessToken, user.id, accessTokenExpires, TokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(process.env.NUXT_ENV_JWT_REFRESH_EXPIRATION_DAYS, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, TokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenTypes.REFRESH);

  // return {
  //   access: {
  //     token: accessToken,
  //     expires: accessTokenExpires.toDate(),
  //   },
  //   refresh: {
  //     token: refreshToken,
  //     expires: refreshTokenExpires.toDate(),
  //   },
  // };
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};
/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: IUser): Promise<string> => {
  const expires = moment().add(process.env.NUXT_ENV_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, TokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, TokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};
