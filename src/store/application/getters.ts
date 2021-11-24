import { IApplicationFrontend, IApplicationFrontendQueryResult } from '@/interfaces/IApplication';
import { IApplicationState } from './state';

export interface IApplicationGetters {
  applications(state: IApplicationState): IApplicationFrontend[];
  queryResult(state: IApplicationState): Omit<IApplicationFrontendQueryResult, 'results'>;
}

export const ApplicationGetters: IApplicationGetters = {
  applications(state) {
    return state.applications.results;
  },
  queryResult(state) {
    return state.applications;
  },
};

export default ApplicationGetters;
