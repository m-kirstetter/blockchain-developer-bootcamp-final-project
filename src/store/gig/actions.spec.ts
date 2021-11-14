import Vuex, { Store } from 'vuex';
import { GigDefaultState } from '@/store/gig/state';
import { IState } from '@/interfaces/IState';
import { IGig } from '@/interfaces/IGig';
import { GigActions } from '@/store/gig/actions';
import { GigMutations } from '@/store/gig/mutations';
import { GigGetters } from '@/store/gig/getters';
import { AxiosMock, getAxiosMock } from '@/test/test-utils';

describe('GigActions', () => {
  let store: Store<IState>;
  let axiosMock: AxiosMock;
  let fixture: IGig;

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

    fixture = { id: '1' };
  });

  describe('fetchGigs', () => {
    test('it should call SET_GIGS on success', async () => {
      axiosMock.onGet('/gigs').reply(200, fixture);

      await store.dispatch('gig/fetchGigs');

      expect(store.commit).toHaveBeenCalledWith('gig/SET_GIGS', fixture, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onGet('/gigs').reply(500);

      try {
        await store.dispatch('gig/fetchGigs');
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });

  describe('fetchGig', () => {
    test('it should call SET_CURRENT_GIG on success', async () => {
      axiosMock.onGet('/gigs/1').reply(200, fixture);

      await store.dispatch('gig/fetchGig', '1');

      expect(store.commit).toHaveBeenCalledWith('gig/SET_CURRENT_GIG', fixture, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onGet('/gigs/1').reply(500);

      try {
        await store.dispatch('gig/fetchGig', '1');
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });

  describe('createGig', () => {
    test('it should call ADD_GIG on success', async () => {
      axiosMock.onPost('/gigs').reply(200, fixture);

      await store.dispatch('gig/createGig', fixture);

      expect(store.commit).toHaveBeenCalledWith('gig/ADD_GIG', fixture, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onPost('/gigs').reply(500);

      try {
        await store.dispatch('gig/createGig', fixture);
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });

  describe('updateGig', () => {
    test('it should call UPDATE_GIG on success', async () => {
      axiosMock.onPut('/gigs/1').reply(200, fixture);

      await store.dispatch('gig/updateGig', fixture);

      expect(store.commit).toHaveBeenCalledWith('gig/UPDATE_GIG', fixture, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onPut('/gigs/1').reply(500);

      try {
        await store.dispatch('gig/updateGig', fixture);
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });

  describe('deleteGig', () => {
    test('it should call DELETE_GIG on success', async () => {
      axiosMock.onDelete('/gigs/1').reply(200, fixture);

      await store.dispatch('gig/deleteGig', fixture);

      expect(store.commit).toHaveBeenCalledWith('gig/DELETE_GIG', fixture, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onDelete('/gigs/1').reply(500);

      try {
        await store.dispatch('gig/deleteGig', fixture);
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });
});
