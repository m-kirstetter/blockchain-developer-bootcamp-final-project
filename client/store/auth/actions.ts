import { ActionTree } from "vuex";
import { getNonce } from "~/services/auth";
import { AuthRootState } from "./index";

const AuthActions: ActionTree<AuthRootState, AuthRootState> = {
  async getNonce({ commit, state, dispatch, rootGetters }): Promise<void> {
    const user = await getNonce(rootGetters["ethers/getUserAddress"]);
    commit('nonce', user.nonce);
  },
};

export default AuthActions;
