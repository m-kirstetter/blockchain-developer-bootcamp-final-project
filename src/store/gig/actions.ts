import { ActionContext } from 'vuex';
import { IState } from '@/interfaces/IState';
import { IGigFrontend } from '@/interfaces/IGig';
import { addToast } from '@/components/utils';
import { IGigsQuery } from '@/api/models/gig.model';
import { IGigState } from './state';

export interface IGigActions {
  fetchGigs(context: ActionContext<IGigState, IState>, query: Partial<IGigsQuery>): Promise<void>;
  createGig(context: ActionContext<IGigState, IState>, gig: IGigFrontend): Promise<void>;
  updateGig(context: ActionContext<IGigState, IState>, toUpdate: Partial<IGigFrontend>): Promise<void>;
}

export const GigActions: IGigActions = {
  async fetchGigs({ commit }, query) {
    try {
      const response = await this.$axios.$get('/api/v1/gigs', {
        params: query,
      });

      commit('SET_GIGS', response.gigs);
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
  async updateGig(_context, toUpdate) {
    const gigId = toUpdate._id;
    delete toUpdate._id;

    try {
      await this.$axios.$patch('/api/v1/gigs/' + gigId, toUpdate);

      addToast({
        title: 'Success!',
        type: 'success',
        text: 'Gig has been updated.',
      });
    } catch (error) {
      addToast({
        title: 'Error!',
        type: 'danger',
        text: error,
      });
    }
  },
};

export default GigActions;
