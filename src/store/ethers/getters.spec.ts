import { EthersGetters } from './getters';
import { EthersDefaultState, IEthersState } from './state';

describe('EthersGetters', () => {
  let testState: IEthersState;

  beforeEach(() => {
    testState = EthersDefaultState();
  });

  test('it should get the ethers', () => {
    expect(EthersGetters.connected(testState)).toEqual(testState.connected);
  });
});
