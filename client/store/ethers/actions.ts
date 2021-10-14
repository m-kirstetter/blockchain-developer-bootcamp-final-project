import { ActionTree } from "vuex";
import { EthersRootState } from "./index";
import {
  connect,
  event,
  ready,
  getProvider,
  getWallet,
  getWalletAddress,
  getNetName,
  hasEns
} from "~/services/ethers";
import { EthersMessages } from "~/enums/ethers-messages";
import { EVENT_CHANNEL } from "~/constants/ethers.constant";

const EthersActions: ActionTree<EthersRootState, EthersRootState> = {
  async connect({ commit, state, dispatch }): Promise<void> {
    try {
      const oldAddress = state.address;
      const oldNetwork = state.network;

      const provider = getProvider();
      if (!provider) throw new Error(EthersMessages.NOT_CONNECTED);

      const wallet = getWallet();
      if (!wallet) throw new Error(EthersMessages.NO_WALLET);

      const address = await getWalletAddress();
      const network = await getNetName();

      if (network !== oldNetwork || address !== oldAddress) {
        commit("SET_CONNECTED", true);
        commit("SET_ERROR", null);
        commit("SET_ADDRESS", address);
        commit("SET_USER", address);
        commit("SET_NETWORK", network);

        // Other vuex stores can wait for this
        event.$emit(EVENT_CHANNEL, EthersMessages.ETHERS_VUEX_READY);

        // now check for .eth address too
        if ((await hasEns()) && address) {
          console.log("Net supports ENS. Checking...");
          commit("SET_ENS", await provider.lookupAddress(address));
          if (state.ens) {
            commit("SET_USER", state.ens);
          }
        }
      }
    } catch (err) {
      dispatch("disconnect", err);
    }
  },
  async disconnect({ commit, state, dispatch }, err: any): Promise<void> {
    const oldAddress = state.address;
    commit("SET_CONNECTED", false);
    commit("SET_ERROR", err);
    commit("SET_ADDRESS", "");
    commit("SET_USER", "");
    commit("SET_NETWORK", "");
    commit("SET_ENS", null);
  },
  async logout({ commit, state, dispatch }): Promise<void> {
    commit("SET_ADDRESS", "");
    commit("SET_USER", "");
  },
  async notConnected({ commit, state, dispatch }): Promise<void> {
    commit("SET_ADDRESS", "");
    commit("SET_USER", "");
  },
  async walletConnect({ commit, state, dispatch }): Promise<void> {
    await connect();
  },
  async init({ commit, state, dispatch }): Promise<void> {
    commit("SET_LOADING", true);

    event.$on(EVENT_CHANNEL, async function(message: EthersMessages) {
      console.log("Ethers event received", message);
      switch (message) {
        case EthersMessages.NOT_READY:
          await dispatch("disconnect");
          break;
        case EthersMessages.NO_WALLET:
          await dispatch("logout");
          break;
        case EthersMessages.ACCOUNT_CHANGED:
          await dispatch("connect");
          break;
        case EthersMessages.NOT_CONNECTED:
          await dispatch("notConnected");
          break;
      }
    });

    if (ready()) {
      await dispatch("connect");
      event.$emit(EVENT_CHANNEL, EthersMessages.ETHERS_VUEX_INITIALIZED);
    } else {
      // await connect();
    }

    commit("SET_INITIALIZED", true);
    commit("SET_LOADING", false);
  }
};

export default EthersActions;
