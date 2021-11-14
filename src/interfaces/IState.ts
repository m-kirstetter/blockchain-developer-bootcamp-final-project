import { IEthersState } from '@/store/ethers/state';
import { IGigState } from '@/store/gig/state';

export interface IState {
  i18n: {
    locale: string;
  };
  ethers: IEthersState;
  gig: IGigState;
}
