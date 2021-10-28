import Axios, { AxiosResponse } from "axios";
import { AuthServiceTokensResponse } from "~/interfaces/auth";

interface getNoncePayload {
  address: string;
}

interface validateSignaturePayload {
  address: string;
  signature: string;
}

export async function getNonce(
  getNoncePayload: getNoncePayload
): Promise<number> {
  const result: AxiosResponse = await Axios.post(
    `${process.env.NUXT_ENV_API}/auth/nonce`,
    getNoncePayload as getNoncePayload
  );

  const nonce: number = result.data.user.nonce;
  return nonce;
}

export async function validateSignature(
  validateSignaturePayload: validateSignaturePayload
): Promise<AuthServiceTokensResponse> {
  const result: AxiosResponse = await Axios.post(
    `${process.env.NUXT_ENV_API}/auth/token`,
    validateSignaturePayload as validateSignaturePayload
  );

  const tokens: AuthServiceTokensResponse = result.data.tokens;
  return tokens;
}

export default {
  getNonce,
  validateSignature
};
