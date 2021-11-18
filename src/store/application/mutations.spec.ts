import { Schema } from 'mongoose';
import { IApplicationStatuses, IStatuses } from '@/interfaces/IStatuses';
import { ApplicationMutations } from './mutations';
import { ApplicationDefaultState, IApplicationState } from './state';

describe('ApplicationMutations', () => {
  let testState: IApplicationState;

  beforeEach(() => {
    testState = ApplicationDefaultState();
  });

  test('it should set applications', () => {
    const expected = {
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
      limit: 10,
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };

    ApplicationMutations.SET_APPLICATIONS(testState, expected);
    expect(testState.applications).toEqual(expected);
  });

  test('it should add an application', () => {
    const application = {
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
    ApplicationMutations.ADD_APPLICATION(testState, application);
    expect(testState.applications.results).toEqual([application]);

    // application.status = 'Declined';

    // ApplicationMutations.UPDATE_APPLICATION(testState, application);
    // expect(testState.applications.results).toEqual([application]);
  });
});
