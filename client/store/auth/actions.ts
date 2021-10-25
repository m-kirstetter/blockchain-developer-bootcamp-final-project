import { ActionTree } from "vuex";
import { getNonce, createUser } from "~/services/auth";
import { AuthRootState } from "./index";

const AuthActions: ActionTree<AuthRootState, AuthRootState> = {
  async getNonce({ commit, state, dispatch, rootGetters }): Promise<any> {
    const result = await getNonce(rootGetters["ethers/getUserAddress"]);
    if (result) return result;
  },

  createUser({ commit, state, dispatch }, address: string): any {
    const result = createUser(address);
    return result;
  }
};

export default AuthActions;
