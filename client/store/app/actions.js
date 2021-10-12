import { getContract, getContractRw } from "../ethers/connectEthers";
import { utils } from "ethers";

const AppActions = {
  async getGigs({ commit, state, dispatch }) {
    // Smart Contract
    const localContract = await getContract();
    // Get gigs count
    const gigsCount = await localContract.gigsCount();
    commit("SET_GIGS_COUNT", gigsCount.toString());
    if (gigsCount > 0) {
      let gigs = [];
      for (let i = 1; i < parseInt(gigsCount) + 1; i++) {
        // Get unique Gig
        const gig = await localContract.gigs(i.toString());
        const enrolled = gig.enrolled;
        let freelancers = [];
        if (enrolled > 0) {
          for (let j = 0; j < enrolled; j++) {
            // Get Gig freelancers
            const freelancer = await localContract.enrolledFreelancers(
              i.toString(),
              j.toString()
            );
            freelancers.push(freelancer);
          }
        }
        const worksNumber = gig.works;
        let works = [];
        if (worksNumber > 0) {
          for (let k = 0; k < worksNumber; k++) {
            // Get Gig freelancers work
            const submittedWork = await localContract.worksByGig(
              i.toString(),
              k.toString()
            );
            works.push(submittedWork.owner);
          }
        }
        // Push works to Gig
        gigs.push(formatGig(gig, freelancers, works, i, state));
      }
      commit("SET_GIGS", gigs);
    }
  },
  async create({ commit, state, dispatch }, gig) {
    const localContract = await getContractRw();
    localContract.createGig(gig.title, gig.freelancers.toString(), {
      value: utils.parseEther(gig.compensation.toString()),
    });
  },
  async enroll({ commit, state, dispatch }, id) {
    const localContract = await getContractRw();
    localContract.enroll(id.toString());
  },
  async submit({ commit, state, dispatch }, work) {
    const localContract = await getContractRw();
    return await localContract.submitWork(work.gigId.toString(), work.contract);
  },
};

// To format gig
function formatGig(gig, freelancers, works, id, state) {
  const formatedGig = {
    id,
    name: gig.name,
    compensation: gig.compensation.toString(),
    status: state.const.gigStatusMappingKeys[gig.status],
    owner: gig.owner,
    freelancersNumber: gig.freelancersNumber,
    freelancers,
    worksSubmitted: gig.works,
    works,
    awardedTo: gig.awardedTo,
  };
  return formatedGig;
}

export default AppActions;
