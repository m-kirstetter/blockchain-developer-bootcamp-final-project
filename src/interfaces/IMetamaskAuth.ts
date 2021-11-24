export interface IMetamaskAuthServiceToken {
  expires: Date;
  token: string;
}

export interface IMetamaskAuthServiceTokensResponse {
  access: IMetamaskAuthServiceToken;
  refresh: IMetamaskAuthServiceToken;
}

export interface INonceRequestPayload {
  address: string;
}

export interface IValidateSignatureRequestPayload {
  address: string;
  signature: string;
}
