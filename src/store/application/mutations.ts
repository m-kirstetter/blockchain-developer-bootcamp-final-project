import { IApplicationFrontend, IApplicationFrontendQueryResult } from '@/interfaces/IApplication';
import { IApplicationState } from './state';

export interface IApplicationMutations {
  SET_APPLICATIONS(state: IApplicationState, applications: IApplicationFrontendQueryResult): void;
  ADD_APPLICATION(state: IApplicationState, application: IApplicationFrontend): void;
}

export const ApplicationMutations: IApplicationMutations = {
  SET_APPLICATIONS: (state, response) => {
    state.applications = response;
  },
  ADD_APPLICATION: (state, application) => {
    const results = state.applications.results;
    results.unshift(application);
    state.applications.results = results;
  },
};

export default ApplicationMutations;
