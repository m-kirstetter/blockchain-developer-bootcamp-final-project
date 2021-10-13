import ModalsDefaultState from "./state";
import ModalsActions from "./actions";
import ModalsMutations from "./mutations";
import ModalsGetters from "./getters";

export type ModalsRootState = ReturnType<typeof ModalsDefaultState>;

export default {
  ModalsDefaultState,
  ModalsActions,
  ModalsMutations,
  ModalsGetters
};
