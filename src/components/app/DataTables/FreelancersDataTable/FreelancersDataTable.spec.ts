import { render, RenderResult } from '@testing-library/vue';
import Vuex, { Store } from 'vuex';
import { GigDefaultState, IGigState } from '@/store/gig/state';
import { GigActions } from '@/store/gig/actions';
import { GigGetters } from '@/store/gig/getters';
import { GigMutations } from '@/store/gig/mutations';
import { AuthStoreModule } from '@/test/test-utils';
import { i18n } from '@/test/i18n';
import Vue from 'vue';
import moment from 'vue-moment';
import FreelancersDataTable from './FreelancersDataTable.vue';

Vue.use(moment);

describe('FreelancersDataTable.vue', () => {
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

    harness = render(FreelancersDataTable, {
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

    getAllByTestId('freelancers-data-table');
  });
});
