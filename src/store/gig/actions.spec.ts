import Vuex, { Store } from 'vuex';
import { GigDefaultState } from '@/store/gig/state';
import { IState } from '@/interfaces/IState';
import { IGigFrontend, IGigFrontendQueryResult } from '@/interfaces/IGig';
import { GigActions } from '@/store/gig/actions';
import { GigMutations } from '@/store/gig/mutations';
import { GigGetters } from '@/store/gig/getters';
import { AxiosMock, getAxiosMock } from '@/test/test-utils';
import { Schema } from 'mongoose';
import { IStatuses } from '@/interfaces/IStatuses';

describe('GigActions', () => {
  let store: Store<IState>;
  let axiosMock: AxiosMock;
  let gig: IGigFrontend;
  let gigs: IGigFrontendQueryResult;

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
      },
    } as any);

    axiosMock = getAxiosMock();

    store.$axios = axiosMock;
    store.commit = jest.fn();

    gig = {
      _id: '618f74e652e1bd099b345a03',
      title: 'title',
      description: 'description',
      details: 'details',
      skills: 'skills',
      owner: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
      status: 'Registered' as IStatuses,
      budget: {
        _id: '618f74e652e1bd099b345a03',
        min: 1,
        max: 4,
      },
      createdAt: '2021-11-13T08:18:46.652Z',
      updatedAt: '2021-11-13T08:18:46.652Z',
    };

    // try with nested gigs object
    gigs = {
      limit: 10,
      page: 1,
      totalPages: 1,
      totalResults: 2,
      results: [
        {
          _id: '618f74e652e1bd099b345a03',
          title: 'title',
          description: 'description',
          details: 'details',
          skills: 'skills',
          owner: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
          status: 'Registered' as IStatuses,
          budget: {
            _id: '618f74e652e1bd099b345a03',
            min: 1,
            max: 4,
          },
          createdAt: '2021-11-13T08:18:46.652Z',
          updatedAt: '2021-11-13T08:18:46.652Z',
        },
        {
          _id: '618f74e652e1bd099b345a03',
          title: 'title',
          description: 'description',
          details: 'details',
          skills: 'skills',
          owner: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
          status: 'Registered' as IStatuses,
          budget: {
            _id: '618f74e652e1bd099b345a03',
            min: 1,
            max: 4,
          },
          createdAt: '2021-11-13T08:18:46.652Z',
          updatedAt: '2021-11-13T08:18:46.652Z',
        },
      ],
    };
  });

  describe('fetchGigs', () => {
    test('it should call SET_GIGS on success', async () => {
      axiosMock.onGet('/api/v1/gigs').reply(200, { gigs });

      await store.dispatch('gig/fetchGigs');

      expect(store.commit).toHaveBeenCalledWith('gig/SET_GIGS', gigs, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onGet('/api/v1/gigs').reply(500);

      try {
        await store.dispatch('gig/fetchGigs');
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });

  describe('createGig', () => {
    test('it should call ADD_GIG on success', async () => {
      axiosMock.onPost('/api/v1/gigs').reply(200, { gig });

      await store.dispatch('gig/createGig', gig);

      expect(store.commit).toHaveBeenCalledWith('gig/ADD_GIG', gig, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onPost('/api/v1/gigs').reply(500);

      try {
        await store.dispatch('gig/createGig', gig);
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });
});
