import { IGigFrontend, IGigFrontendQueryResult } from '@/interfaces/IGig';
import { IGigState } from './state';

export interface IGigMutations {
  SET_GIGS(state: IGigState, gigs: IGigFrontendQueryResult): void;
  ADD_GIG(state: IGigState, gig: IGigFrontend): void;
  UPDATE_GIG(state: IGigState, gig: IGigFrontend): void;
}

export const GigMutations: IGigMutations = {
  SET_GIGS: (state, response) => {
    state.gigs = response;
  },
  ADD_GIG: (state, gig) => {
    const results = state.gigs.results;
    results.unshift(gig);
    state.gigs.results = results;
  },
  UPDATE_GIG: (state, gig) => {
    const idx = state.gigs.results.findIndex((item) => item._id === gig._id);
    state.gigs.results.splice(idx, 1, gig);
  },
};

export default GigMutations;
