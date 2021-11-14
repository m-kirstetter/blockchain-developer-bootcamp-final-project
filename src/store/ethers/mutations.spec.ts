import { EthersMutations } from './mutations';
import { EthersDefaultState, IEthersState } from './state';

describe('EthersMutations', () => {
  let testState: IEthersState;

  beforeEach(() => {
    testState = EthersDefaultState();
  });

  test('it should set ethers', () => {
    const expected = [{ id: '1' }];

    EthersMutations.SET_ETHERS(testState, expected);
    expect(testState.ethers).toEqual(expected);
  });

  test('it should set currentEther', () => {
    const expected = { id: '1' };

    EthersMutations.SET_CURRENT_ETHER(testState, expected);
    expect(testState.currentEther).toEqual(expected);
  });

  test('it should add and update a ether', () => {
    const ether = { id: '1' };
    EthersMutations.ADD_ETHER(testState, ether);
    expect(testState.ethers).toEqual([ether]);

    ether.id = '2';

    EthersMutations.UPDATE_ETHER(testState, ether);
    expect(testState.ethers).toEqual([ether]);
  });

  test('it should delete a ether', () => {
    const ether = { id: '1' };
    EthersMutations.ADD_ETHER(testState, ether);
    expect(testState.ethers).toHaveLength(1);

    EthersMutations.DELETE_ETHER(testState, ether);
    expect(testState.ethers).toHaveLength(0);
  });
});
