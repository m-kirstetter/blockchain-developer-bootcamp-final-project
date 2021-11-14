import { IGigFrontend } from '@/interfaces/IGig';
import { IGigState } from './state';

export interface IGigMutations {
  SET_GIGS(state: IGigState, gigs: IGigFrontend[]): void;
  ADD_GIG(state: IGigState, gig: IGigFrontend): void;
  UPDATE_GIG(state: IGigState, gig: IGigFrontend): void;
  DELETE_GIG(state: IGigState, gig: IGigFrontend): void;
}

export const GigMutations: IGigMutations = {
  SET_GIGS: (state, gigs) => {
    state.gigs = gigs;
  },
  ADD_GIG: (state, gig) => {
    state.gigs.push(gig);
  },
  UPDATE_GIG: (state, gig) => {
    const idx = state.gigs.findIndex((item) => item._id === gig._id);
    state.gigs.splice(idx, 1, gig);
  },
  DELETE_GIG: (state, gig) => {
    const idx = state.gigs.findIndex((item) => item._id === gig._id);
    state.gigs.splice(idx, 1);
  },
};

export default GigMutations;
