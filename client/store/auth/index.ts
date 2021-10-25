import AuthDefaultState from "./state";
import AuthActions from "./actions";
import AuthMutations from "./mutations";
import AuthGetters from "./getters";

export type AuthRootState = ReturnType<typeof AuthDefaultState>;

export default {
  AuthDefaultState,
  AuthActions,
  AuthMutations,
  AuthGetters
};
