export interface AuthServiceUser {
  role: string;
  isEmailVerified: boolean;
  address: string;
  nonce: number;
  id: string;
}

export interface AuthServiceUserResponse {
  user: AuthServiceUser;
}

export interface AuthServiceTokenResponse {
  expires: Date;
  token: string;
}

export interface AuthServiceTokensResponse {
  access: AuthServiceTokenResponse;
  refresh: AuthServiceTokenResponse;
}
