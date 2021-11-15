import { ActionContext } from 'vuex';
import { IState } from '@/interfaces/IState';
import { IGigFrontend } from '@/interfaces/IGig';
import { addToast } from '@/components/utils';
import { IGigState } from './state';

export interface IGigActions {
  fetchGigs(context: ActionContext<IGigState, IState>): Promise<any>;
  createGig(context: ActionContext<IGigState, IState>, gig: IGigFrontend): Promise<any>;
  updateGig(context: ActionContext<IGigState, IState>, gig: IGigFrontend): Promise<any>;
}

export const GigActions: IGigActions = {
  async fetchGigs({ commit }) {
    try {
      const response = await this.$axios.$get('/api/v1/gigs', {
        params: { status: 'Registered', sortBy: 'title:asc' },
      });

      const { results } = response.gigs;

      commit('SET_GIGS', results);
    } catch (error) {
      addToast({
        title: 'Error fetching Gigs!',
        type: 'danger',
        text: error,
      });
    }
  },
  async createGig({ commit }, newGig) {
    try {
      const response = await this.$axios.$post('/api/v1/gigs', newGig);

      addToast({
        title: 'Success!',
        type: 'success',
        text: 'Gig has been posted.',
      });

      const { gig } = response;

      commit('ADD_GIG', gig);
    } catch (error) {
      addToast({
        title: 'Error!',
        type: 'danger',
        text: error,
      });
    }
  },
  async updateGig({ commit }, gig) {
    const data = await this.$axios.$put('/api/v1/gigs/' + gig._id, gig);
    commit('UPDATE_GIG', data);
  },
};

export default GigActions;
