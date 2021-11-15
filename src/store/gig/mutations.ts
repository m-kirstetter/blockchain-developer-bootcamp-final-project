import { IGigFrontend } from '@/interfaces/IGig';
import { IGigState } from './state';

export interface IGigMutations {
  SET_GIGS(state: IGigState, gigs: IGigFrontend[]): void;
  ADD_GIG(state: IGigState, gig: IGigFrontend): void;
  UPDATE_GIG(state: IGigState, gig: IGigFrontend): void;
}

export const GigMutations: IGigMutations = {
  SET_GIGS: (state, gigs) => {
    state.gigs = gigs;
  },
  ADD_GIG: (state, gig) => {
    // Add in beginning of the array
    state.gigs.unshift(gig);
  },
  UPDATE_GIG: (state, gig) => {
    const idx = state.gigs.findIndex((item) => item._id === gig._id);
    state.gigs.splice(idx, 1, gig);
  },
};

export default GigMutations;
