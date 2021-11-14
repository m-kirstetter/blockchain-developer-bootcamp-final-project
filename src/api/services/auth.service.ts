import { ethers } from 'ethers';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { TokenTypes } from '../enums/TokenTypes';
import { verifyToken, generateAuthTokens } from './token.service';
import { getUserById } from './user.service';

/**
 * Check signature
 * @param {string} address
 * @param {string} signature
 * @param {string} nonce
 * @returns {Promise<boolean>}
 */
export const checkSignature = (address: string, signature: string, nonce: string): boolean => {
  let result = false;

  const bytes32Nonce = ethers.utils.formatBytes32String(nonce);
  const actualAddress = ethers.utils.verifyMessage(bytes32Nonce, signature);

  if (address.toLowerCase() === actualAddress.toLowerCase()) {
    result = true;
  }

  return result;
};

export const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, TokenTypes.REFRESH);
    const user = await getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await refreshTokenDoc.remove();
    return generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
// const verifyEmail = async (verifyEmailToken) => {
//   try {
//     const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
//     const user = await userService.getUserById(verifyEmailTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
//     await userService.updateUserById(user.id, { isEmailVerified: true });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
//   }
// };
