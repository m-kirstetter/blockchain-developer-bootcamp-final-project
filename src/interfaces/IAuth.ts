export interface IAuthServiceUser {
  role: string;
  isEmailVerified: boolean;
  address: string;
  nonce: number;
  id: string;
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
