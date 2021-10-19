import { MutationTree } from "vuex";
import { Network } from "@ethersproject/networks";
import { ErrorCode } from "@ethersproject/logger";
import { EthersRootState } from "./index";

const EthersMutations: MutationTree<EthersRootState> = {
  SET_INITIALIZED: function(state, value: boolean): void {
    state.initialized = value;
  },
  SET_CONNECTED: function(state, value: boolean): void {
    state.connected = value;
  },
  SET_ERROR: function(state, value: ErrorCode): void {
    state.error = value;
  },
  SET_USER: function(state, value: string): void {
    state.user = value;
  },
  SET_ADDRESS: function(state, value: string): void {
    state.address = value;
  },
  SET_NETWORK: function(state, value: Network): void {
    state.network = value;
  },
  SET_ENS: function(state, value: string): void {
    state.ens = value;
  },
  SET_LOADING: function(state, value: boolean): void {
    state.loading = value;
  }
};

export default EthersMutations;
