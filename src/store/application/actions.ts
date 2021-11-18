import { ActionContext } from 'vuex';
import { IState } from '@/interfaces/IState';
import { addToast } from '@/components/utils';
import { IApplicationsQuery } from '@/api/models/application.model';
import { IApplicationFrontend } from '@/interfaces/IApplication';
import { IApplicationState } from './state';

export interface IApplicationActions {
  fetchApplications(
    context: ActionContext<IApplicationState, IState>,
    query: Partial<IApplicationsQuery>,
  ): Promise<void>;
  createApplication(
    context: ActionContext<IApplicationState, IState>,
    application: IApplicationFrontend,
  ): Promise<void>;
}

export const ApplicationActions: IApplicationActions = {
  async fetchApplications({ commit }, query) {
    try {
      const response = await this.$axios.$get('/api/v1/applications', {
        params: query,
      });

      commit('SET_APPLICATIONS', response.applications);
    } catch (error) {
      addToast({
        title: 'Error fetching Applications!',
        type: 'danger',
        text: error,
      });
    }
  },
  async createApplication({ commit }, newApplication) {
    try {
      const response = await this.$axios.$post('/api/v1/applications', newApplication);

      addToast({
        title: 'Success!',
        type: 'success',
        text: 'Application has been posted.',
      });

      const { application } = response;

      commit('ADD_APPLICATION', application);
    } catch (error) {
      addToast({
        title: 'Error!',
        type: 'danger',
        text: error,
      });
    }
  },
};

export default ApplicationActions;
