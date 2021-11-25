import { IContractFrontend } from '@/interfaces/IContract';
import { IContractState } from './state';

export interface IContractMutations {
  SET_CONTRACTS(state: IContractState, contracts: IContractFrontend[]): void;
  SET_CURRENT_CONTRACT(state: IContractState, contract: IContractFrontend): void;
  ADD_CONTRACT(state: IContractState, contract: IContractFrontend): void;
  UPDATE_CONTRACT(state: IContractState, contract: IContractFrontend): void;
  DELETE_CONTRACT(state: IContractState, contract: IContractFrontend): void;
}

export const ContractMutations: IContractMutations = {
  SET_CONTRACTS: (state, contracts) => {
    state.contracts = contracts;
  },
  SET_CURRENT_CONTRACT: (state, contract) => {
    state.currentContract = contract;
  },
  ADD_CONTRACT: (state, contract) => {
    state.contracts.push(contract);
  },
  UPDATE_CONTRACT: (state, contract) => {
    const idx = state.contracts.findIndex((item) => item._id === contract._id);
    state.contracts.splice(idx, 1, contract);
  },
  DELETE_CONTRACT: (state, contract) => {
    const idx = state.contracts.findIndex((item) => item._id === contract._id);
    state.contracts.splice(idx, 1);
  },
};

export default ContractMutations;
