import { render, RenderResult } from '@testing-library/vue';
import Vuex, { Store } from 'vuex';
import { EthersDefaultState, IEthersState } from '@/store/ethers/state';
import { EthersActions } from '@/store/ethers/actions';
import { EthersGetters } from '@/store/ethers/getters';
import { EthersMutations } from '@/store/ethers/mutations';
import Index from './index.vue';

describe('Index.vue', () => {
  let store: Store<IEthersState>;
  let harness: RenderResult;

  const EthersModule = {
    namespaced: true,
    state: () => EthersDefaultState(),
    mutations: EthersMutations,
    actions: EthersActions,
    getters: EthersGetters,
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        ethers: EthersModule,
      },
    } as any);
    harness = render(Index, {
      mocks: {
        $nuxt: {
          context: {
            store,
          },
        },
      },
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('Connect with Metamask');
  });
});
