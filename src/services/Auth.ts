import Axios, { AxiosResponse } from 'axios';
import { IGetNoncePayload } from '@/interfaces/IAuth';

export async function getNonce(getNoncePayload: IGetNoncePayload): Promise<number> {
  const result: AxiosResponse = await Axios.post(
    `${process.env.NUXT_ENV_API}/auth/nonce`,
    getNoncePayload as IGetNoncePayload,
  );

  const nonce: number = result.data.user.nonce;
  return nonce;
}

export default {
  getNonce,
};
