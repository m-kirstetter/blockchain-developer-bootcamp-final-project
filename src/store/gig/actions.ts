import { ActionContext } from 'vuex';
import { IState } from '@/interfaces/IState';
import { IGigFrontend } from '@/interfaces/IGig';
import { addToast } from '@/components/utils';
import { IGigState } from './state';

export interface IGigActions {
  fetchGigs(context: ActionContext<IGigState, IState>): Promise<any>;
  fetchGig(context: ActionContext<IGigState, IState>, id: string): Promise<any>;
  createGig(context: ActionContext<IGigState, IState>, gig: IGigFrontend): Promise<any>;
  updateGig(context: ActionContext<IGigState, IState>, gig: IGigFrontend): Promise<any>;
  deleteGig(context: ActionContext<IGigState, IState>, gig: IGigFrontend): Promise<any>;
}

export const GigActions: IGigActions = {
  async fetchGigs({ commit }) {
    const data = await this.$axios.$get('/api/v1/gigs', {
      params: { status: 'Registered', sortBy: 'title:asc' },
    });
    commit('SET_GIGS', data.gigs.results);
  },
  async fetchGig({ commit }, id) {
    const data = await this.$axios.$get(`/gigs/${id}`);
    commit('SET_CURRENT_GIG', data);
  },
  async createGig({ dispatch }, gig) {
    try {
      await this.$axios.$post('/api/v1/gigs', gig);

      addToast({
        title: 'Success!',
        type: 'success',
        text: 'Gig has been posted.',
      });

      dispatch('fetchGigs');
    } catch (error) {
      addToast({
        title: 'Error!',
        type: 'danger',
        text: error,
      });
    }
  },
  async updateGig({ commit }, gig) {
    const data = await this.$axios.$put('/gigs/' + gig._id, gig);
    commit('UPDATE_GIG', data);
  },
  async deleteGig({ commit }, gig) {
    await this.$axios.$delete('/gigs/' + gig._id);
    commit('DELETE_GIG', gig);
  },
};

export default GigActions;
