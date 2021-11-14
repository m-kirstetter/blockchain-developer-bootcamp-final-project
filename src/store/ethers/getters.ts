import { IEthersState } from './state';

export interface IEthersGetters {
  connected(state: IEthersState): boolean;
}

export const EthersGetters: IEthersGetters = {
  connected(state) {
    return state.connected;
  },
};

export default EthersGetters;
