import AppDefaultState from "./state";
import AppActions from "./actions";
import AppMutations from "./mutations";
import AppGetters from "./getters";

export type AppRootState = ReturnType<typeof AppDefaultState>;

export default {
  AppDefaultState,
  AppActions,
  AppMutations,
  AppGetters
};
