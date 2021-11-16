import { IGigFrontendQueryResult } from '@/interfaces/IGig';

export interface IGigState {
  gigs: IGigFrontendQueryResult;
}

export const GigDefaultState = (): IGigState => {
  return {
    gigs: {
      results: [],
      limit: 10,
      page: 1,
      totalPages: 1,
      totalResults: 0,
    },
  };
};

export default GigDefaultState;
