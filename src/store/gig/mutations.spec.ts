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
    const expected = [
      {
        _id: 1,
        title: 'title',
        description: 'description',
        details: 'details',
        skills: 'skills',
        owner: ('570b570b570bfffffffffffb' as unknown) as Schema.Types.ObjectId,
        status: 'Registered' as IStatuses,
        budget: {
          min: 1,
          max: 4,
        },
      },
      {
        _id: 2,
        title: 'title 2',
        description: 'description 2',
        details: 'details 2',
        skills: 'skills 2',
        owner: ('570b570b570bfffffffffffc' as unknown) as Schema.Types.ObjectId,
        status: 'Registered' as IStatuses,
        budget: {
          min: 2,
          max: 3,
        },
      },
    ];

    GigMutations.SET_GIGS(testState, expected);
    expect(testState.gigs).toEqual(expected);
  });

  test('it should add and update a gig', () => {
    const gig = {
      _id: 2,
      title: 'title',
      description: 'description',
      details: 'details',
      skills: 'skills',
      owner: ('570b570b570bfffffffffffc' as unknown) as Schema.Types.ObjectId,
      status: 'Registered' as IStatuses,
      budget: {
        min: 2,
        max: 3,
      },
    };
    GigMutations.ADD_GIG(testState, gig);
    expect(testState.gigs).toEqual([gig]);

    gig.description = 'updated description';

    GigMutations.UPDATE_GIG(testState, gig);
    expect(testState.gigs).toEqual([gig]);
  });

  test('it should delete a gig', () => {
    const gig = {
      _id: 2,
      title: 'title',
      description: 'description',
      details: 'details',
      skills: 'skills',
      owner: ('570b570b570bfffffffffffc' as unknown) as Schema.Types.ObjectId,
      status: 'Registered' as IStatuses,
      budget: {
        min: 2,
        max: 3,
      },
    };
    GigMutations.ADD_GIG(testState, gig);
    expect(testState.gigs).toHaveLength(1);

    GigMutations.DELETE_GIG(testState, gig);
    expect(testState.gigs).toHaveLength(0);
  });
});
