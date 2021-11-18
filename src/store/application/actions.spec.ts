import Vuex, { Store } from 'vuex';
import { ApplicationDefaultState } from '@/store/application/state';
import { IState } from '@/interfaces/IState';
import { IApplicationFrontend, IApplicationFrontendQueryResult } from '@/interfaces/IApplication';
import { ApplicationActions } from '@/store/application/actions';
import { ApplicationMutations } from '@/store/application/mutations';
import { ApplicationGetters } from '@/store/application/getters';
import { AxiosMock, getAxiosMock } from '@/test/test-utils';
import { Schema } from 'mongoose';
import { IApplicationStatuses } from '@/interfaces/IStatuses';

describe('ApplicationActions', () => {
  let store: Store<IState>;
  let axiosMock: AxiosMock;
  let application: IApplicationFrontend;
  let applications: IApplicationFrontendQueryResult;

  const ApplicationModule = {
    namespaced: true,
    state: () => ApplicationDefaultState(),
    mutations: ApplicationMutations,
    actions: ApplicationActions,
    getters: ApplicationGetters,
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        application: ApplicationModule,
      },
    } as any);

    axiosMock = getAxiosMock();

    store.$axios = axiosMock;
    store.commit = jest.fn();

    application = {
      _id: '618f74e652e1bd099b345a03',
      why: 'title',
      owner: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
      status: 'Applied' as IApplicationStatuses,
      gig: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
      milestones: [
        {
          order: 1,
          title: 'Milestone 1',
          amount: 2.3,
        },
        {
          order: 2,
          title: 'Milestone 2',
          amount: 5,
        },
      ],
      createdAt: '2021-11-13T08:18:46.652Z',
      updatedAt: '2021-11-13T08:18:46.652Z',
    };

    applications = {
      limit: 10,
      page: 1,
      totalPages: 1,
      totalResults: 2,
      results: [
        {
          _id: '618f74e652e1bd099b345a03',
          why: 'title',
          owner: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
          status: 'Applied' as IApplicationStatuses,
          gig: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
          milestones: [
            {
              order: 1,
              title: 'Milestone 1',
              amount: 2.3,
            },
            {
              order: 2,
              title: 'Milestone 2',
              amount: 5,
            },
          ],
          createdAt: '2021-11-13T08:18:46.652Z',
          updatedAt: '2021-11-13T08:18:46.652Z',
        },
        {
          _id: '618f74e652e1bd099b345a03',
          why: 'title 2',
          owner: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
          status: 'Applied' as IApplicationStatuses,
          gig: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
          milestones: [
            {
              order: 1,
              title: 'Milestone 1',
              amount: 3,
            },
            {
              order: 2,
              title: 'Milestone 2',
              amount: 5,
            },
          ],
          createdAt: '2021-11-13T08:18:46.652Z',
          updatedAt: '2021-11-13T08:18:46.652Z',
        },
      ],
    };
  });

  describe('fetchApplications', () => {
    test('it should call SET_APPLICATIONS on success', async () => {
      axiosMock.onGet('/api/v1/applications').reply(200, { applications });

      await store.dispatch('application/fetchApplications');

      expect(store.commit).toHaveBeenCalledWith('application/SET_APPLICATIONS', applications, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onGet('/api/v1/applications').reply(500);

      try {
        await store.dispatch('application/fetchApplications');
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });

  describe('createApplication', () => {
    test('it should call ADD_APPLICATION on success', async () => {
      axiosMock.onPost('/api/v1/applications').reply(200, { application });

      await store.dispatch('application/createApplication', application);

      expect(store.commit).toHaveBeenCalledWith('application/ADD_APPLICATION', application, undefined);
    });

    test('it should throw an error on failure', async () => {
      axiosMock.onPost('/api/v1/applications').reply(500);

      try {
        await store.dispatch('application/createApplication', application);
      } catch (e) {
        expect(e.message).toEqual('Request failed with status code 500');
      }
    });
  });
});
