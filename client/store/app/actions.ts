import Vue from "Vue";
import { ActionTree } from "vuex";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { AppRootState } from "./index";
import { GigFormInput, GigWorkFormat } from "~/interfaces/gig";
import { BootstrapVariant } from "~/enums/bootstrap-variant";
import { Alert } from "~/interfaces/app";
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

  async create(
    { commit, state, dispatch },
    gig: GigFormInput
  ): Promise<TransactionResponse> {
    commit("SET_LOADING", true);

    return createGigService(gig);
  },

  async enroll(
    { commit, state, dispatch },
    id: string
  ): Promise<TransactionResponse> {
    commit("SET_LOADING", true);

    return enrollGigService(id);
  },

  async submit(
    { commit, state, dispatch },
    work: GigWorkFormat
  ): Promise<TransactionResponse> {
    commit("SET_LOADING", true);

    return submitGigService(work);
  },

  resetGigs({ commit, state, dispatch }): void {
    commit("SET_GIGS", []);
    commit("SET_GIGS_COUNT", 0);
  },

  alert(
    { commit, state, dispatch },
    { text, title, variant, show }: Alert
  ): void {
    commit("SET_ALERT", {
      text,
      title,
      variant,
      show
    });
  },

  resetAlert({ commit, state, dispatch }): void {
    commit("SET_ALERT", {
      text: "",
      variant: BootstrapVariant.SUCCESS,
      show: false
    });
  }
};

export default AppActions;
