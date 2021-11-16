import EthersService from '@/services/Ethers';
import abi from '@/plugins/ethers/contracts_SmartGigs_sol_SmartGigs.json';

function isEthers(value: any): value is EthersService {
  return value instanceof EthersService;
}

test('Ethers is an instance of EthersService', () => {
  const Ethers = new EthersService(process.env.NUXT_ENV_CONTRACT, JSON.stringify(abi));

  const result = isEthers(Ethers);
  expect(result).toBe(true);
});

test('string is not an instance of EthersService', () => {
  const Ethers = 'string';

  const result = isEthers(Ethers);
  expect(result).toBe(false);
});
