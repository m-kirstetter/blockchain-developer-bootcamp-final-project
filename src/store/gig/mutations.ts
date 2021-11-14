import { IGig } from '@/interfaces/IGig';
import { IGigState } from './state';

export interface IGigMutations {
  SET_GIGS(state: IGigState, gigs: IGig[]): void;
  SET_CURRENT_GIG(state: IGigState, gig: IGig): void;
  ADD_GIG(state: IGigState, gig: IGig): void;
  UPDATE_GIG(state: IGigState, gig: IGig): void;
  DELETE_GIG(state: IGigState, gig: IGig): void;
}

export const GigMutations: IGigMutations = {
  SET_GIGS: (state, gigs) => {
    state.gigs = gigs;
  },
  SET_CURRENT_GIG: (state, gig) => {
    state.currentGig = gig;
  },
  ADD_GIG: (state, gig) => {
    state.gigs.push(gig);
  },
  UPDATE_GIG: (state, gig) => {
    const idx = state.gigs.findIndex((item) => item.id === gig.id);
    state.gigs.splice(idx, 1, gig);
  },
  DELETE_GIG: (state, gig) => {
    const idx = state.gigs.findIndex((item) => item.id === gig.id);
    state.gigs.splice(idx, 1);
  },
};

export default GigMutations;
