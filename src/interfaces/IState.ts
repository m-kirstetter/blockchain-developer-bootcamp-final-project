import { IEthersState } from '@/store/ethers/state';
import { IGigState } from '@/store/gig/state';
import { IApplicationState } from '@/store/application/state';

export interface IState {
  i18n: {
    locale: string;
  };
  ethers: IEthersState;
  gig: IGigState;
  application: IApplicationState;
}
