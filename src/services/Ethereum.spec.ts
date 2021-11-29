import EthereumService from '@/services/Ethereum';
import SmarterContractFactory from '@/../build/contracts/SmarterContractFactory.json';
import SmarterContract from '@/../build/contracts/SmarterContract.json';

function isEthereum(value: any): value is EthereumService {
  return value instanceof EthereumService;
}

test('Ethereum is an instance of EthereumService', () => {
  const Ethereum = new EthereumService(
    process.env.NUXT_ENV_FACTORY_CONTRACT,
    JSON.stringify(SmarterContractFactory.abi),
    JSON.stringify(SmarterContract.abi),
  );

  const result = isEthereum(Ethereum);
  expect(result).toBe(true);
});

test('string is not an instance of EthereumService', () => {
  const Ethereum = 'string';

  const result = isEthereum(Ethereum);
  expect(result).toBe(false);
});
