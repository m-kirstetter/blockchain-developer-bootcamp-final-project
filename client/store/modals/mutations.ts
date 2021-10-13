import { MutationTree } from "vuex";
import { ModalsRootState } from "./index";
import { Modal } from "~/interfaces/modal";

const ModalsMutations: MutationTree<ModalsRootState> = {
  SET_SUBMITWORK_MODAL(state, value: Modal): void {
    state.submitWork = value;
  },
  SET_POSTGIG_MODAL(state, value: Modal): void {
    state.postGig = value;
  }
};

export default ModalsMutations;
