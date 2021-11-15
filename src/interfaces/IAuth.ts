export interface IAuthServiceUser {
  // role: string;
  // isEmailVerified: boolean;
  // address: string;
  // nonce: number;
  // id: string;
  _id: string;
  address: string;
  bio: string;
  createdAt: string;
  email: string;
  firstname: string;
  fullname: string;
  isEmailVerified: boolean;
  lastname: string;
  nonce: number;
  role: string;
  updatedAt: string;
}

export interface IAuthServiceUserResponse {
  user: IAuthServiceUser;
}

export interface IAuthServiceTokenResponse {
  expires: Date;
  token: string;
}

export interface IAuthServiceTokensResponse {
  access: IAuthServiceTokenResponse;
  refresh: IAuthServiceTokenResponse;
}

export interface IGetNoncePayload {
  address: string;
}

export interface IValidateSignaturePayload {
  address: string;
  signature: string;
}
