import { MutationTree } from "vuex";
import { AppRootState } from "./index";
import { Gig } from "~/interfaces/gig";

const AppMutations: MutationTree<AppRootState> = {
  SET_GIGS_COUNT(state, data: number): void {
    state.gigsCount = data;
  },
  SET_GIGS(state, data: Gig[]): void {
    state.gigs = data;
  }
};

export default AppMutations;
