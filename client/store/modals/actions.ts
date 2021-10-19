import { ActionTree } from "vuex";
import { ModalsRootState } from "./index";
import { ModalInterface } from "./state";

const ModalsActions: ActionTree<ModalsRootState, ModalsRootState> = {
  openPostGigModal({ commit, state, dispatch }, data: ModalInterface): void {
    commit("SET_POSTGIG_MODAL", data);
  },
  openSubmitWorkModal({ commit, state, dispatch }, data: ModalInterface): void {
    commit("SET_SUBMITWORK_MODAL", data);
  }
};

export default ModalsActions;
