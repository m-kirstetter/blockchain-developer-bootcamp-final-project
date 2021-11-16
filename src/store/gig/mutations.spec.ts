import { Schema } from 'mongoose';
import { IStatuses } from '@/interfaces/IStatuses';
import { GigMutations } from './mutations';
import { GigDefaultState, IGigState } from './state';

describe('GigMutations', () => {
  let testState: IGigState;

  beforeEach(() => {
    testState = GigDefaultState();
  });

  test('it should set gigs', () => {
    const expected = {
      results: [
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
      ],
      limit: 10,
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };

    GigMutations.SET_GIGS(testState, expected);
    expect(testState.gigs).toEqual(expected);
  });

  test('it should add and update a gig', () => {
    const gig = {
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
    };
    GigMutations.ADD_GIG(testState, gig);
    expect(testState.gigs.results).toEqual([gig]);

    gig.description = 'updated description';

    GigMutations.UPDATE_GIG(testState, gig);
    expect(testState.gigs.results).toEqual([gig]);
  });
});
