import { IGig } from '@/interfaces/IGig';
import { IGigState } from './state';

export interface IGigGetters {
  gigs(state: IGigState): IGig[];
  currentGig(state: IGigState): IGig;
}

export const GigGetters: IGigGetters = {
  gigs(state) {
    return state.gigs;
  },
  currentGig(state) {
    return state.currentGig;
  },
};

export default GigGetters;
