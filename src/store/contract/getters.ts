import { IContractFrontend } from '@/interfaces/IContract';
import { IContractState } from './state';

export interface IContractGetters {
  contracts(state: IContractState): IContractFrontend[];
  currentContract(state: IContractState): IContractFrontend;
}

export const ContractGetters: IContractGetters = {
  contracts(state) {
    return state.contracts;
  },
  currentContract(state) {
    return state.currentContract;
  },
};

export default ContractGetters;
