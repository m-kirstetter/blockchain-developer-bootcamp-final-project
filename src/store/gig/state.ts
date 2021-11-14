import { IGigFrontend } from '@/interfaces/IGig';

export interface IGigState {
  gigs: IGigFrontend[];
}

export const GigDefaultState = (): IGigState => {
  return {
    gigs: [],
  };
};

export default GigDefaultState;
