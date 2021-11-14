import { EthersGetters } from './getters';
import { EthersDefaultState, IEthersState } from './state';

describe('EthersGetters', () => {
  let testState: IEthersState;

  beforeEach(() => {
    testState = EthersDefaultState();
  });

  test('it should get the ethers', () => {
    expect(EthersGetters.ethers(testState)).toEqual(testState.ethers);
  });

  test('it should get the ethers', () => {
    expect(EthersGetters.currentEther(testState)).toEqual(testState.currentEther);
  });
});
