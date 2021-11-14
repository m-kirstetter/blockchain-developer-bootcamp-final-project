import { Network } from '@ethersproject/networks';
import { ErrorCode } from '@ethersproject/logger';
import { IEthersState } from './state';

export interface IEthersMutations {
  SET_CONNECTED(state: IEthersState, value: boolean): void;
  SET_ERROR(state: IEthersState, value: ErrorCode): void;
  SET_USER(state: IEthersState, value: string): void;
  SET_ADDRESS(state: IEthersState, value: string): void;
  SET_NETWORK(state: IEthersState, value: Network): void;
  SET_ENS(state: IEthersState, value: string): void;
  SET_LOADING(state: IEthersState, value: boolean): void;
}

export const EthersMutations: IEthersMutations = {
  SET_CONNECTED(state, value): void {
    state.connected = value;
  },
  SET_ERROR(state, value): void {
    state.error = value;
  },
  SET_USER(state, value): void {
    state.user = value;
  },
  SET_ADDRESS(state, value): void {
    state.address = value;
  },
  SET_NETWORK(state, value): void {
    state.network = value;
  },
  SET_ENS(state, value): void {
    state.ens = value;
  },
  SET_LOADING(state, value): void {
    state.loading = value;
  },
};

export default EthersMutations;
