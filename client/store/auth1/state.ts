export interface AuthInterface {
  loading: boolean;
}

const AuthDefaultState = (): AuthInterface => ({
  loading: false
});

export default AuthDefaultState;
