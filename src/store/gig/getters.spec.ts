import { GigGetters } from './getters';
import { GigDefaultState, IGigState } from './state';

describe('GigGetters', () => {
  let testState: IGigState;

  beforeEach(() => {
    testState = GigDefaultState();
  });

  test('it should get the gigs', () => {
    expect(GigGetters.gigs(testState)).toEqual(testState.gigs);
  });
});
