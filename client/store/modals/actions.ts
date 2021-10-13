import { ActionTree } from "vuex";
import { ModalsRootState } from "./index";
import { Modal } from "~/interfaces/modal";

const ModalsActions: ActionTree<ModalsRootState, ModalsRootState> = {
  openPostGigModal({ commit, state, dispatch }, data: Modal): void {
    commit("SET_POSTGIG_MODAL", data);
  },
  openSubmitWorkModal({ commit, state, dispatch }, data: Modal): void {
    commit("SET_SUBMITWORK_MODAL", data);
  }
};

export default ModalsActions;
