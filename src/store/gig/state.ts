import { IGig } from '@/interfaces/IGig';

export interface IGigState {
  gigs: IGig[];
}

export const GigDefaultState = (): IGigState => {
  return {
    gigs: [],
  };
};

export default GigDefaultState;
