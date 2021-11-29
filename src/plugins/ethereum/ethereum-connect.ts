import { Plugin } from '@nuxt/types';
import EthereumService from '@/services/Ethereum';
import SmarterContractFactory from '@/../build/contracts/SmarterContractFactory.json';
import SmarterContract from '@/../build/contracts/SmarterContract.json';

const EthereumConnection = new EthereumService(
  process.env.NUXT_ENV_FACTORY_CONTRACT,
  JSON.stringify(SmarterContractFactory.abi),
  JSON.stringify(SmarterContract.abi),
);

declare module 'vue/types/vue' {
  // this.$ethereum inside Vue components
  interface Vue {
    $ethereum: EthereumService;
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$ethereum inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $ethereum: EthereumService;
  }
  // nuxtContext.$ethereum
  interface Context {
    $ethereum: EthereumService;
  }
}

declare module 'vuex/types/index' {
  // this.$ethereum inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $ethereum: EthereumService;
  }
}

const ethereum: Plugin = (_context, inject) => {
  inject('ethereum', EthereumConnection);
};

export default ethereum;
