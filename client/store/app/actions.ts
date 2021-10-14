import { ActionTree } from "vuex";
import { AppRootState } from "./index";
import { GigFormInput, GigWorkFormat } from "~/interfaces/gig";
import {
  getGigsService,
  createGigService,
  enrollGigService,
  submitGigService
} from "~/services/gigs";

const AppActions: ActionTree<AppRootState, AppRootState> = {
  async getGigs({ commit, state, dispatch }): Promise<void> {
    commit("SET_LOADING", true);

    getGigsService()
      .then(result => {
        commit("SET_GIGS", result.gigs);
        commit("SET_GIGS_COUNT", result.gigsCount);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  },

  async create({ commit, state, dispatch }, gig: GigFormInput): Promise<void> {
    commit("SET_LOADING", true);

    createGigService(gig).then(result => {
      // @TODO push to pending tx store
      console.log(result);
    });
  },

  async enroll({ commit, state, dispatch }, id: string): Promise<void> {
    commit("SET_LOADING", true);

    enrollGigService(id).then(result => {
      // @TODO push to pending tx store
      console.log(result);
    });
  },

  async submit(
    { commit, state, dispatch },
    work: GigWorkFormat
  ): Promise<void> {
    commit("SET_LOADING", true);

    submitGigService(work).then(result => {
      // @TODO push to pending tx store
      console.log(result);
    });
  },

  resetGigs({ commit, state, dispatch }): void {
    commit("SET_GIGS", []);
    commit("SET_GIGS_COUNT", 0);
  }
};

export default AppActions;
