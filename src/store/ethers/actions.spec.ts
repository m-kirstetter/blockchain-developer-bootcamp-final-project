import Vuex, { Store } from 'vuex';
import { EthersDefaultState } from '@/store/ethers/state';
import { IState } from '@/interfaces/IState';
import { IEthers } from '@/interfaces/IEthers';
import { EthersActions } from '@/store/ethers/actions';
import { EthersMutations } from '@/store/ethers/mutations';
import { EthersGetters } from '@/store/ethers/getters';
import { AxiosMock, getAxiosMock } from '@/test/test-utils';

describe('EthersActions', () => {
  let store: Store<IState>;
  let axiosMock: AxiosMock;
  let fixture: IEthers;

  const EtherModule = {
    namespaced: true,
    state: () => EthersDefaultState(),
    mutations: EthersMutations,
    actions: EthersActions,
    getters: EthersGetters,
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        ether: EtherModule,
      },
    } as any);

    axiosMock = getAxiosMock();

    store.$axios = axiosMock;
    store.commit = jest.fn();

    // fixture = { _id: '1' };
  });

  describe('TODO: REAL TESTS', () => {
    test('you should write tests here', () => {
      const data = 1;

      expect(data).toEqual(data);
    });
  });

  // describe('fetchEthers', () => {
  //   test('it should call SET_ETHERS on success', async () => {
  //     axiosMock.onGet('/ethers').reply(200, fixture);

  //     await store.dispatch('ether/fetchEthers');

  //     expect(store.commit).toHaveBeenCalledWith('ether/SET_ETHERS', fixture, undefined);
  //   });

  //   test('it should throw an error on failure', async () => {
  //     axiosMock.onGet('/ethers').reply(500);

  //     try {
  //       await store.dispatch('ether/fetchEthers');
  //     } catch (e) {
  //       expect(e.message).toEqual('Request failed with status code 500');
  //     }
  //   });
  // });

  // describe('fetchEther', () => {
  //   test('it should call SET_CURRENT_ETHER on success', async () => {
  //     axiosMock.onGet('/ethers/1').reply(200, fixture);

  //     await store.dispatch('ether/fetchEther', '1');

  //     expect(store.commit).toHaveBeenCalledWith('ether/SET_CURRENT_ETHER', fixture, undefined);
  //   });

  //   test('it should throw an error on failure', async () => {
  //     axiosMock.onGet('/ethers/1').reply(500);

  //     try {
  //       await store.dispatch('ether/fetchEther', '1');
  //     } catch (e) {
  //       expect(e.message).toEqual('Request failed with status code 500');
  //     }
  //   });
  // });

  // describe('createEther', () => {
  //   test('it should call ADD_ETHER on success', async () => {
  //     axiosMock.onPost('/ethers').reply(200, fixture);

  //     await store.dispatch('ether/createEther', fixture);

  //     expect(store.commit).toHaveBeenCalledWith('ether/ADD_ETHER', fixture, undefined);
  //   });

  //   test('it should throw an error on failure', async () => {
  //     axiosMock.onPost('/ethers').reply(500);

  //     try {
  //       await store.dispatch('ether/createEther', fixture);
  //     } catch (e) {
  //       expect(e.message).toEqual('Request failed with status code 500');
  //     }
  //   });
  // });

  // describe('updateEther', () => {
  //   test('it should call UPDATE_ETHER on success', async () => {
  //     axiosMock.onPut('/ethers/1').reply(200, fixture);

  //     await store.dispatch('ether/updateEther', fixture);

  //     expect(store.commit).toHaveBeenCalledWith('ether/UPDATE_ETHER', fixture, undefined);
  //   });

  //   test('it should throw an error on failure', async () => {
  //     axiosMock.onPut('/ethers/1').reply(500);

  //     try {
  //       await store.dispatch('ether/updateEther', fixture);
  //     } catch (e) {
  //       expect(e.message).toEqual('Request failed with status code 500');
  //     }
  //   });
  // });

  // describe('deleteEther', () => {
  //   test('it should call DELETE_ETHER on success', async () => {
  //     axiosMock.onDelete('/ethers/1').reply(200, fixture);

  //     await store.dispatch('ether/deleteEther', fixture);

  //     expect(store.commit).toHaveBeenCalledWith('ether/DELETE_ETHER', fixture, undefined);
  //   });

  //   test('it should throw an error on failure', async () => {
  //     axiosMock.onDelete('/ethers/1').reply(500);

  //     try {
  //       await store.dispatch('ether/deleteEther', fixture);
  //     } catch (e) {
  //       expect(e.message).toEqual('Request failed with status code 500');
  //     }
  //   });
  // });
});
