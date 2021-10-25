export interface AuthInterface {
  nonce: string | null;
}

const AuthDefaultState = (): AuthInterface => ({
  nonce: null
});

export default AuthDefaultState;
