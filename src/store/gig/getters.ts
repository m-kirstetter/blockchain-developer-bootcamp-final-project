import { IGigFrontend, IGigFrontendQueryResult } from '@/interfaces/IGig';
import { IGigState } from './state';

export interface IGigGetters {
  gigs(state: IGigState): IGigFrontend[];
  queryResult(state: IGigState): Omit<IGigFrontendQueryResult, 'results'>;
}

export const GigGetters: IGigGetters = {
  gigs(state) {
    return state.gigs.results;
  },
  queryResult(state) {
    return state.gigs;
  },
};

export default GigGetters;
