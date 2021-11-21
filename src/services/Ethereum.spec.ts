import EthereumService from '@/services/Ethereum';
import abi from '@/plugins/ethereum/contracts_SmartGigs_sol_SmartGigs.json';

function isEthereum(value: any): value is EthereumService {
  return value instanceof EthereumService;
}

test('Ethereum is an instance of EthereumService', () => {
  const Ethereum = new EthereumService(process.env.NUXT_ENV_CONTRACT, JSON.stringify(abi));

  const result = isEthereum(Ethereum);
  expect(result).toBe(true);
});

test('string is not an instance of EthereumService', () => {
  const Ethereum = 'string';

  const result = isEthereum(Ethereum);
  expect(result).toBe(false);
});
