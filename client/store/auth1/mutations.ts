import { MutationTree } from "vuex";
import { AuthRootState } from "./index";

const AuthMutations: MutationTree<AuthRootState> = {
  SET_LOADING(state, value: boolean): void {
    state.loading = value;
  }
};

export default AuthMutations;
