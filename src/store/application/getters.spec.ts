import { ApplicationGetters } from './getters';
import { ApplicationDefaultState, IApplicationState } from './state';

describe('ApplicationGetters', () => {
  let testState: IApplicationState;

  beforeEach(() => {
    testState = ApplicationDefaultState();
  });

  test('it should get the applications', () => {
    expect(ApplicationGetters.applications(testState)).toEqual(testState.applications.results);
  });
});
