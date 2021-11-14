import { GigMutations } from './mutations';
import { GigDefaultState, IGigState } from './state';

describe('GigMutations', () => {
  let testState: IGigState;

  beforeEach(() => {
    testState = GigDefaultState();
  });

  test('it should set gigs', () => {
    const expected = [{ id: '1' }];

    GigMutations.SET_GIGS(testState, expected);
    expect(testState.gigs).toEqual(expected);
  });

  test('it should set currentGig', () => {
    const expected = { id: '1' };

    GigMutations.SET_CURRENT_GIG(testState, expected);
    expect(testState.currentGig).toEqual(expected);
  });

  test('it should add and update a gig', () => {
    const gig = { id: '1' };
    GigMutations.ADD_GIG(testState, gig);
    expect(testState.gigs).toEqual([gig]);

    gig.id = '2';

    GigMutations.UPDATE_GIG(testState, gig);
    expect(testState.gigs).toEqual([gig]);
  });

  test('it should delete a gig', () => {
    const gig = { id: '1' };
    GigMutations.ADD_GIG(testState, gig);
    expect(testState.gigs).toHaveLength(1);

    GigMutations.DELETE_GIG(testState, gig);
    expect(testState.gigs).toHaveLength(0);
  });
});
