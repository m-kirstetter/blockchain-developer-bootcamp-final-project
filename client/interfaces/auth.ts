export interface AuthServiceUser {
  role: string;
  isEmailVerified: boolean;
  address: string;
  nonce: number;
  id: string;
}

export interface AuthServiceUserResponse {
  user: AuthServiceUser
}