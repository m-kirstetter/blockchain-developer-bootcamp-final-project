import { MutationTree } from "vuex";
import { AppRootState } from "./index";
import { Gig } from "~/interfaces/gig";
import { Alert } from "~/interfaces/app";

const AppMutations: MutationTree<AppRootState> = {
  SET_GIGS_COUNT(state, value: number): void {
    state.gigsCount = value;
  },
  SET_GIGS(state, data: Gig[]): void {
    state.gigs = data;
  },
  SET_LOADING(state, value: boolean): void {
    state.loading = value;
  },
  SET_ALERT(state, value: Alert): void {
    state.alert = value;
  }
};

export default AppMutations;
