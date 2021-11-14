import { IGigFrontend } from '@/interfaces/IGig';
import { IGigState } from './state';

export interface IGigGetters {
  gigs(state: IGigState): IGigFrontend[];
}

export const GigGetters: IGigGetters = {
  gigs(state) {
    return state.gigs;
  },
};

export default GigGetters;
