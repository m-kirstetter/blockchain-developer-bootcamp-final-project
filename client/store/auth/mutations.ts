import { MutationTree } from "vuex";
import { AuthRootState } from "./index";

const AuthMutations: MutationTree<AuthRootState> = {
  SET_NONCE(state, value): void {
    state.nonce = value;
  }
};

export default AuthMutations;
