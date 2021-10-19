import { MutationTree } from "vuex";
import { ModalsRootState } from "./index";
import { ModalInterface } from "./state";

const ModalsMutations: MutationTree<ModalsRootState> = {
  SET_SUBMITWORK_MODAL(state, value: ModalInterface): void {
    state.submitWork = value;
  },
  SET_POSTGIG_MODAL(state, value: ModalInterface): void {
    state.postGig = value;
  }
};

export default ModalsMutations;
