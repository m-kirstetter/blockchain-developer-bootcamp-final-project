import { render, RenderResult } from '@testing-library/vue';
import Vuex, { Store } from 'vuex';
import { IGigState } from '@/store/gig/state';
import { GigActions } from '@/store/gig/actions';
import { GigGetters } from '@/store/gig/getters';
import { GigMutations } from '@/store/gig/mutations';
import { AuthStoreModule } from '@/test/test-utils';
import { i18n } from '@/test/i18n';
import Vue from 'vue';
import moment from 'vue-moment';
import { GigCollectionFixture } from '@/fixtures/GigFixture';
import Gigs from './gigs.vue';

Vue.use(moment);

const GigDefaultState = (): IGigState => {
  return {
    gigs: {
      results: GigCollectionFixture(),
      limit: 10,
      page: 1,
      totalPages: 1,
      totalResults: 3,
    },
  };
};

describe('Gigs.vue', () => {
  let store: Store<IGigState>;
  let harness: RenderResult;

  const GigModule = {
    namespaced: true,
    state: () => GigDefaultState(),
    mutations: GigMutations,
    actions: GigActions,
    getters: GigGetters,
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        gig: GigModule,
        auth: AuthStoreModule,
      },
    } as any);

    harness = render(Gigs, {
      i18n,
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
    const { getAllByTestId } = harness;

    getAllByTestId('gigs-page');
  });
});
