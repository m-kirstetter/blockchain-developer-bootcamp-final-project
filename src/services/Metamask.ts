import detectEthereumProvider from '@metamask/detect-provider';

const metamaskService = {
  async getEthereum(): Promise<any> {
    return await detectEthereumProvider({ mustBeMetaMask: true });
  },
};

export default metamaskService;
