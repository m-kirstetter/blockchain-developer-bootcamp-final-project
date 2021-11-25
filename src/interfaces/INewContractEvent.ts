import { BigNumber } from '@ethersproject/bignumber';

export interface INewContractEvent {
  externalId: string;
  index: BigNumber;
  contractAddress: string;
  milestones: BigNumber[];
}
