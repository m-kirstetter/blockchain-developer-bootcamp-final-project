import { utils } from "ethers";
import { ActionTree } from "vuex";
import { AppRootState } from "./index";
import { Gig, GigFormInput } from "~/interfaces/gig";
import { getContract, getContractRw } from "~/services/ethers";
import { GIG_STATUS_MAPPING } from "~/constants/gig-status.constant";

const AppActions: ActionTree<AppRootState, AppRootState> = {
  async getGigs({ commit, state, dispatch }): Promise<void> {
    commit("SET_LOADING", true);
    // Smart Contract
    const localContract = await getContract();

    // Get gigs count
    let gigsCount;
    try {
      gigsCount = await localContract.gigsCount();
    } catch (error) {
      commit("SET_LOADING", false);
      throw new Error("Something went wrong getting gigsCount.");
    }
    commit("SET_GIGS_COUNT", gigsCount.toString());

    if (gigsCount > 0) {
      let gigs = [];
      for (let i = 1; i < parseInt(gigsCount) + 1; i++) {
        // Get unique Gig
        let gig;
        try {
          gig = await localContract.gigs(i.toString());
        } catch (error) {
          commit("SET_LOADING", false);
          throw new Error("Something went wrong getting gig.");
        }
        const enrolled = gig.enrolled;
        let freelancers = [];
        if (enrolled > 0) {
          for (let j = 0; j < enrolled; j++) {
            // Get Gig freelancers
            let freelancer;
            try {
              freelancer = await localContract.enrolledFreelancers(
                i.toString(),
                j.toString()
              );
            } catch (error) {
              commit("SET_LOADING", false);
              throw new Error("Something went wrong getting freelancer.");
            }
            freelancers.push(freelancer);
          }
        }
        const worksNumber = gig.works;
        let works = [];
        if (worksNumber > 0) {
          for (let k = 0; k < worksNumber; k++) {
            // Get Gig freelancers work
            let submittedWork;
            try {
              submittedWork = await localContract.worksByGig(
                i.toString(),
                k.toString()
              );
            } catch (error) {
              commit("SET_LOADING", false);
              throw new Error("Something went wrong getting work.");
            }
            works.push(submittedWork.owner);
          }
        }
        // Push works to Gig
        gigs.push(formatGig(gig, freelancers, works, i));
      }
      commit("SET_GIGS", gigs);
      commit("SET_LOADING", false);
    }
  },
  async create({ commit, state, dispatch }, gig: GigFormInput): Promise<void> {
    commit("SET_LOADING", true);
    let localContract;
    try {
      localContract = await getContractRw();
      localContract.createGig(gig.title, gig.freelancers.toString(), {
        value: utils.parseEther(gig.compensation.toString())
      });
    } catch (error) {
      commit("SET_LOADING", false);
      throw new Error("Something went wrong creating the gig.");
    }
  },
  async enroll({ commit, state, dispatch }, id: string): Promise<void> {
    commit("SET_LOADING", true);
    let localContract;
    try {
      localContract = await getContractRw();
      localContract.enroll(id.toString());
    } catch (error) {
      commit("SET_LOADING", false);
      throw new Error("Something went wrong with enroll.");
    }
  },
  async submit({ commit, state, dispatch }, work): Promise<any> {
    commit("SET_LOADING", true);
    let localContract;
    try {
      localContract = await getContractRw();
      return await localContract.submitWork(
        work.gigId.toString(),
        work.contract
      );
    } catch (error) {
      commit("SET_LOADING", false);
      throw new Error("Something went wrong with enroll.");
    }
  }
};

// To format gig
function formatGig(
  gig: any,
  freelancers: string[],
  works: string[],
  id: number
): Gig {
  return {
    id,
    name: gig.name,
    compensation: gig.compensation.toString(),
    status: GIG_STATUS_MAPPING[gig.status],
    owner: gig.owner,
    freelancersNumber: gig.freelancersNumber,
    freelancers,
    worksSubmitted: gig.works,
    works,
    awardedTo: gig.awardedTo
  };
}

export default AppActions;
