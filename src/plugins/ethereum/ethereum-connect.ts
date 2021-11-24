import { Plugin } from '@nuxt/types';
import EthereumService from '@/services/Ethereum';
import abi from './contracts_SmartGigs_sol_SmartGigs.json';

const EthereumConnection = new EthereumService(process.env.NUXT_ENV_CONTRACT, JSON.stringify(abi));

declare module 'vue/types/vue' {
  // this.$ethereum inside Vue components
  interface Vue {
    $ethereum(): void;
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$ethereum inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $ethereum(): void;
  }
  // nuxtContext.$ethereum
  interface Context {
    $ethereum(): void;
  }
}

declare module 'vuex/types/index' {
  // this.$ethereum inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $ethereum(): void;
  }
}

const ethereum: Plugin = (_context, inject) => {
  inject('ethereum', EthereumConnection);
};

export default ethereum;
