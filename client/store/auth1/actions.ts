import { ActionTree } from "vuex";
import { getNonce, validateSignature } from "~/services/auth";
import { getWallet } from "~/services/ethers";
import { ethers } from "ethers";
import { AuthRootState } from "./index";
import { EthersMessages } from "~/enums/ethers-messages";
import { EventBus } from "~/plugins/event-bus";
import { BootstrapVariant } from "~/enums/bootstrap-variant";

const AuthActions: ActionTree<AuthRootState, any> = {
  async connectMetamask({ commit, state, dispatch, rootState }): Promise<void> {
    commit("SET_LOADING", true);
    await dispatch("ethers/connectMetamask", {}, { root: true });
    await dispatch("ethers/init", {}, { root: true });
  },

  async authenticate({ commit, state, dispatch, rootState }): Promise<boolean> {
    const address = rootState.ethers.address;

    // Sign message
    const nonce = await getNonce({ address });
    const bytes32Nonce = ethers.utils.formatBytes32String(nonce.toString());
    const signer = getWallet();
    if (!signer) {
      throw new Error(EthersMessages.NOT_CONNECTED);
    }
    const signature = await signer.signMessage(bytes32Nonce).catch(error => {
      commit("SET_LOADING", false);

      if (error.code === 4001) {
        // Toast if user cancel Metamask message signature
        EventBus.$emit("Toast", {
          variant: BootstrapVariant.DANGER,
          text: EthersMessages.NOT_SIGNED,
          title: "Error"
        });

        throw new Error(EthersMessages.NOT_SIGNED);
      } else {
        throw new Error(EthersMessages.UNKNOWN_ERROR);
      }
    });
    // @TODO: Set interface
    const tokens: any = await validateSignature({ address, signature });
    const accessToken = `${tokens.access.token}`;

    this.$auth.setUserToken(accessToken);
    this.$axios.setHeader("Authorization", accessToken);
    this.$auth.ctx.app.$axios.setHeader("Authorization", accessToken);

    commit("SET_LOADING", false);

    return true;
  }
};

export default AuthActions;
