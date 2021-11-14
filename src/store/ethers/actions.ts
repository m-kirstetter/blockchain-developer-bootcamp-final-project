import { ActionContext } from 'vuex';
import { IState } from '@/interfaces/IState';
import { ErrorCode } from '@ethersproject/logger';
import { ethers } from 'ethers';
import { EthersErrors, EthersErrorMessages } from '@/enums/Ethers';
import { addToast } from '@/components/utils';
import { getNonce } from '@/services/Auth';
import { EventBus } from '@/services/EventBus';
import { IEthersState } from './state';

export interface IEthersActions {
  disconnectEthers(context: ActionContext<IEthersState, IState>): void;
  logout(context: ActionContext<IEthersState, IState>): Promise<any>;
  connectEthers(context: ActionContext<IEthersState, IState>): Promise<any>;
  authenticateUser(context: ActionContext<IEthersState, IState>): Promise<void>;
}

export const EthersActions: IEthersActions = {
  async connectEthers({ commit }) {
    try {
      // Connect to Metamask & get address + network
      await this.$ethers.connect();
      const address = await this.$ethers.getWalletAddress();
      const network = this.$ethers.getNetwork();

      // Commit everything
      commit('SET_CONNECTED', true);
      commit('SET_ERROR', null);
      commit('SET_ADDRESS', address);
      commit('SET_USER', address);
      commit('SET_NETWORK', network);
    } catch (error) {
      addToast({
        title: 'Error!',
        type: 'danger',
        text: EthersErrorMessages[error as EthersErrors],
      });
    }
  },

  disconnectEthers({ commit }, error?: ErrorCode) {
    commit('SET_CONNECTED', false);
    commit('SET_ERROR', error);
    commit('SET_ADDRESS', null);
    commit('SET_USER', null);
  },

  async logout({ dispatch }) {
    // We disconnect everything, user will need to sign again to authenticate
    await dispatch('ethers/disconnect', {}, { root: true });
    await dispatch('app/resetGigs', {}, { root: true });
    dispatch('disconnectEthers');
    this.$auth.logout();
  },

  async authenticateUser({ commit, dispatch, state }) {
    commit('SET_LOADING', true);

    await dispatch('connectEthers');

    if (state.network.name !== 'ropsten') {
      EventBus.$emit('wrongNetwork');
      commit('SET_LOADING', false);
      throw new Error('Wrong network.');
    }

    const address = state.address;

    // Sign message
    const nonce = await getNonce({ address });
    const bytes32Nonce = ethers.utils.formatBytes32String(nonce.toString());
    const signer = this.$ethers.getWallet();
    if (!signer) throw EthersErrors.NOT_CONNECTED;

    // Get user to sign and validate the message (login)
    try {
      const signature = await signer.signMessage(bytes32Nonce);

      await this.$auth.loginWith('local', { data: { address, signature } }).then(() => {
        addToast({
          title: 'Success!',
          type: 'success',
          text: 'You logged in successfully.',
        });
      });
    } catch (error) {
      let result: EthersErrors;

      if (error.code === 4001) {
        result = EthersErrors.NOT_SIGNED;
      } else {
        result = EthersErrors.UNKNOWN_ERROR;
      }

      addToast({
        title: 'Error!',
        type: 'danger',
        text: EthersErrorMessages[result],
      });
    }

    commit('SET_LOADING', false);
  },
};

export default EthersActions;
