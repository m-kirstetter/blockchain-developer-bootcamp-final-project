import { Plugin } from '@nuxt/types';
import EthersService from '@/services/Ethers';
import abi from './contracts_SmartGigs_sol_SmartGigs.json';

const EthersConnection = new EthersService(process.env.NUXT_ENV_CONTRACT, JSON.stringify(abi));

declare module 'vue/types/vue' {
  // this.$ethers inside Vue components
  interface Vue {
    $ethers(): void;
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$ethers inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $ethers(): void;
  }
  // nuxtContext.$ethers
  interface Context {
    $ethers(): void;
  }
}

declare module 'vuex/types/index' {
  // this.$ethers inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $ethers(): void;
  }
}

const ethers: Plugin = (_context, inject) => {
  inject('ethers', EthersConnection);
};

export default ethers;
