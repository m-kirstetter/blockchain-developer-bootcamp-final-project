const ModalsActions = {
  openPostGigModal({ commit, state, dispatch }, data) {
    commit("SET_POSTGIG_MODAL", data);
  },
  openSubmitWorkModal({ commit, state, dispatch }, data) {
    commit("SET_SUBMITWORK_MODAL", data);
  },
};

export default ModalsActions;
