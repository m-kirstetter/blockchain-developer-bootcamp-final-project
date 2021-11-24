import { IApplicationFrontendQueryResult } from '@/interfaces/IApplication';

export interface IApplicationState {
  applications: IApplicationFrontendQueryResult;
}

export const ApplicationDefaultState = (): IApplicationState => {
  return {
    applications: {
      results: [],
      limit: 10,
      page: 1,
      totalPages: 1,
      totalResults: 0,
    },
  };
};

export default ApplicationDefaultState;
