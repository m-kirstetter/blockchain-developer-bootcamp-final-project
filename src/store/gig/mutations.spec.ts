import { GigCollectionFixture, GigFixture } from '@/fixtures/GigFixture';
import { GigMutations } from './mutations';
import { GigDefaultState, IGigState } from './state';

describe('GigMutations', () => {
  let testState: IGigState;

  beforeEach(() => {
    testState = GigDefaultState();
  });

  test('it should set gigs', () => {
    const expected = {
      results: GigCollectionFixture(),
      limit: 10,
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };

    GigMutations.SET_GIGS(testState, expected);
    expect(testState.gigs).toEqual(expected);
  });

  test('it should add and update a gig', () => {
    const gig = GigFixture();
    GigMutations.ADD_GIG(testState, gig);
    expect(testState.gigs.results).toEqual([gig]);

    gig.description = 'updated description';

    GigMutations.UPDATE_GIG(testState, gig);
    expect(testState.gigs.results).toEqual([gig]);
  });
});
