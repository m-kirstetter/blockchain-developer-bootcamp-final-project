import { render, RenderResult } from '@testing-library/vue';
import Vuex, { Store } from 'vuex';
import { IGigState } from '@/store/gig/state';
import { GigActions } from '@/store/gig/actions';
import { GigGetters } from '@/store/gig/getters';
import { GigMutations } from '@/store/gig/mutations';
import { AuthStoreModule } from '@/test/test-utils';
import { Schema } from 'mongoose';
import { IStatuses } from '@/interfaces/IStatuses';
import { i18n } from '@/test/i18n';
import Vue from 'vue';
import moment from 'vue-moment';
import Gigs from './gigs.vue';

Vue.use(moment);

const gigs = [
  {
    _id: '1',
    title: 'title',
    description: 'description',
    details: 'details',
    skills: 'skills',
    owner: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
    status: 'Registered' as IStatuses,
    budget: {
      _id: '1',
      min: 1,
      max: 4,
    },
    createdAt: '2021-11-10T08:18:46.652Z',
    updatedAt: '2021-11-13T08:18:46.652Z',
  },
  {
    _id: '2',
    title: 'title 2',
    description: 'description 2',
    details: 'details 2',
    skills: 'skills 2',
    owner: ('570b570b570bfffffffffffc' as unknown) as Schema.Types.ObjectId,
    status: 'Registered' as IStatuses,
    budget: {
      _id: '1',
      min: 2,
      max: 3,
    },
    createdAt: '2021-11-10T08:18:46.652Z',
    updatedAt: '2021-11-13T08:18:46.652Z',
  },
];

const GigDefaultState = (): IGigState => {
  return { gigs };
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
