import { ActionContext } from 'vuex';
import { IState } from '@/interfaces/IState';
import { ErrorCode } from '@ethersproject/logger';
import { EthereumErrors, EthereumErrorMessages } from '@/enums/Ethereum';
import { addToast } from '@/components/utils';
import { getNonce } from '@/services/Auth';
import { EventBus } from '@/services/EventBus';
import { IEthersState } from './state';

export interface IEthersActions {
  disconnectEthereum(context: ActionContext<IEthersState, IState>): void;
  logout(context: ActionContext<IEthersState, IState>): Promise<any>;
  connectEthereum(context: ActionContext<IEthersState, IState>): Promise<any>;
  authenticateUser(context: ActionContext<IEthersState, IState>): Promise<void>;
}

export const EthersActions: IEthersActions = {
  async connectEthereum({ commit }) {
    try {
      // Connect to Metamask & get address + network
      await this.$ethereum.connect();
      const address = await this.$ethereum.getWalletAddress();
      const network = this.$ethereum.network;

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
        text: EthereumErrorMessages[error as EthereumErrors],
      });
    }
  },

  disconnectEthereum({ commit }, error?: ErrorCode) {
    commit('SET_CONNECTED', false);
    commit('SET_ERROR', error);
    commit('SET_ADDRESS', null);
    commit('SET_USER', null);
  },

  async logout({ dispatch }) {
    // We disconnect everything, user will need to sign again to authenticate
    await dispatch('app/resetGigs', {}, { root: true });
    dispatch('disconnectEthereum');
    this.$auth.logout();
  },

  async authenticateUser({ commit, dispatch, state }) {
    commit('SET_LOADING', true);

    await dispatch('connectEthereum');

    if (state.network.name !== 'ropsten') {
      EventBus.$emit('wrongNetwork');
      commit('SET_LOADING', false);
      throw new Error('Wrong network.');
    }

    const address = state.address;

    // Sign message
    const nonce = await getNonce({ address });
    const message = `This is a message to sign with your Metamask wallet. We use a unique nonce to authenticate you. Unique nonce: ${nonce.toString()}`;
    const signer = this.$ethereum.userWallet;
    if (!signer) throw EthereumErrors.NOT_CONNECTED;

    // Get user to sign and validate the message (login)
    try {
      const signature = await signer.signMessage(message);

      await this.$auth.loginWith('local', { data: { address, signature } }).then(() => {
        addToast({
          title: 'Success!',
          type: 'success',
          text: 'You logged in successfully.',
        });
      });
    } catch (error) {
      let result: EthereumErrorMessages | string;

      if (error.code === 4001) {
        result = EthereumErrorMessages[EthereumErrors.NOT_SIGNED];
      } else {
        result = error.message;
      }

      addToast({
        title: 'Error!',
        type: 'danger',
        text: result,
      });
    }

    commit('SET_LOADING', false);
  },
};

export default EthersActions;
