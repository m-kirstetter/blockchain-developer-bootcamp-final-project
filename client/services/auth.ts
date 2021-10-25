import Axios, { AxiosResponse } from "axios";
import { AuthServiceUser, AuthServiceUserResponse } from "~/interfaces/auth";

export async function getNonce(address: string): Promise<AuthServiceUser> {
  // const result = await Axios.get(`${process.env.NUXT_ENV_CONTRACT}/auth/init`, {
  //   params: { address }
  // });
  const result: AuthServiceUserResponse = await Axios.post(`${process.env.NUXT_ENV_CONTRACT}/auth/init`, { address });
  return result.user;
}

export default {
  getNonce
}