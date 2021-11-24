/**
 * Returns a random nonce between 1 and 1.000.000.000.000.000
 * @returns {number}
 */
export const randomNonce = (): number => {
  return Math.floor(Math.random() * (1000000000000000 - 1) + 1);
};
