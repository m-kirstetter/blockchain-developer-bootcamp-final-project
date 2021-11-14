import { providers, Contract, ethers } from 'ethers';
import { ExternalProvider, JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { Network } from '@ethersproject/networks';
import { EthersErrors } from '@/enums/Ethers';
import { IEthersErrorResponse } from '@/interfaces/IEthers';
import { ENS_NETS } from '@/constants/Ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import metamaskService from './Metamask';
import { EventBus } from './EventBus';

export default class EthersConnect {
  contractAddress: string;
  abi: string;
  ethereum: MetaMaskInpageProvider;
  provider: JsonRpcProvider;
  contract: Contract;
  contractRw: Contract;
  network: Network;
  userWallet: JsonRpcSigner;
  currentAccount: string;
  checkInterval: NodeJS.Timeout;

  constructor(contractAddress: string, abi: string) {
    this.contractAddress = contractAddress;
    this.abi = abi;

    // Start Ethereum provider check
    this.checkInterval = setInterval(this.checkProvider.bind(this), 500);
  }

  getNetwork() {
    return this.network;
  }

  hasEns() {
    return this.network?.chainId ? ENS_NETS.includes(this.network?.chainId) : false;
  }

  getProvider() {
    return this.provider;
  }

  getContract() {
    return this.contract;
  }

  getContractRw() {
    return this.contractRw;
  }

  getWallet() {
    return this.userWallet;
  }

  async getWalletAddress() {
    return this.userWallet && (await this.userWallet.getAddress());
  }

  ready() {
    return !!this.provider && !!this.userWallet;
  }

  async checkProvider() {
    // If Ethereum is set, we stop interval
    if (this.ethereum) {
      clearInterval(this.checkInterval);
      return false;
    } else if (
      // If client && ethereum available && ethereum unset,
      // update provider
      process.client &&
      typeof window?.ethereum !== 'undefined' &&
      !this.ethereum &&
      (await metamaskService.getEthereum())
    ) {
      await this._updateProvider();
    }
  }

  async connect() {
    try {
      if (!this.ethereum) throw EthersErrors.NOT_CONNECTED;
      // Request accounts access
      // WARNING: cast Partial<unknown> to string[]....
      const accounts: string[] = await this.ethereum.request({ method: 'eth_requestAccounts' });
      this._handleAccountsChanged(accounts);
    } catch (error) {
      const ethersErrorResponse = error as IEthersErrorResponse;

      if (ethersErrorResponse.code === 4001) {
        throw EthersErrors.CANCELLED_CONNECT_REQUEST;
      } else {
        throw EthersErrors.UNKNOWN_ERROR;
      }
    }
  }

  private async _updateProvider() {
    // Set Ethereum or throw error
    this.ethereum = await metamaskService.getEthereum();
    if (!this.ethereum) throw EthersErrors.NO_ETHEREUM;

    // Set Provider or throw error
    // WARNING: cast MetaMaskInpageProvider to ExternalProvider....
    this.provider = new providers.Web3Provider(this.ethereum as ExternalProvider);
    if (!this.provider) throw EthersErrors.NO_PROVIDER;

    // Set Network and Event to alert if not Ropsten
    this.network = await this.provider.getNetwork();

    // If contract already set, we remove all listeners first
    if (this.contract) this.contract.removeAllListeners();
    this.contract = new Contract(this.contractAddress, this.abi, this.provider);

    this.ethereum.on('chainChanged', this._handleChainChanged);

    // Set accounts
    const accounts: string[] = await this.ethereum.request({
      method: 'eth_accounts',
    });

    this._handleAccountsChanged(accounts);
  }

  private _handleAccountsChanged(accounts: string[]) {
    if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];

      if (this.currentAccount !== null) this.userWallet = this.provider && this.provider.getSigner(this.currentAccount);
      if (this.userWallet !== null)
        this.contractRw = new ethers.Contract(this.contractAddress, this.abi, this.userWallet);
    }
  }

  private _handleChainChanged(_chainId: string) {
    EventBus.$emit('logout', true);
    window.location.reload();
  }
}
