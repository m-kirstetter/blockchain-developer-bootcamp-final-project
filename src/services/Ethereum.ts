import { providers, Contract, ethers } from 'ethers';
import { ExternalProvider, JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { Network } from '@ethersproject/networks';
import { EthereumErrors } from '@/enums/Ethereum';
import { IEthersErrorResponse } from '@/interfaces/IEthers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import metamaskService from './Metamask';
import { EventBus } from './EventBus';

const ENS_NETS: number[] = [1, 3, 4];

export default class EthereumConnect {
  private _contractAddress: string;
  private _abi: string;
  private _ethereum: MetaMaskInpageProvider;
  private _currentAccount: string;
  private _checkInterval: NodeJS.Timeout;

  provider: JsonRpcProvider;
  contract: Contract;
  contractRw: Contract;
  network: Network;
  userWallet: JsonRpcSigner;

  constructor(contractAddress: string, abi: string) {
    this._contractAddress = contractAddress;
    this._abi = abi;

    // Start Ethereum provider check
    this._checkInterval = setInterval(this.checkProvider.bind(this), 500);
  }

  hasEns() {
    return this.network?.chainId ? ENS_NETS.includes(this.network?.chainId) : false;
  }

  async getWalletAddress() {
    return this.userWallet && (await this.userWallet.getAddress());
  }

  ready() {
    return !!this.provider && !!this.userWallet;
  }

  async checkProvider() {
    // If Ethereum is set, we stop interval
    if (this._ethereum) {
      clearInterval(this._checkInterval);
      return false;
    } else if (
      // If client && ethereum available && ethereum unset,
      // update provider
      process.client &&
      typeof window?.ethereum !== 'undefined' &&
      !this._ethereum &&
      (await metamaskService.getEthereum())
    ) {
      await this._updateProvider();
    }
  }

  async connect() {
    try {
      if (!this._ethereum) throw EthereumErrors.NOT_CONNECTED;
      // Request accounts access
      // WARNING: cast Partial<unknown> to string[]....
      const accounts: string[] = await this._ethereum.request({ method: 'eth_requestAccounts' });
      this._handleAccountsChanged(accounts);
    } catch (error) {
      const ethersErrorResponse = error as IEthersErrorResponse;

      if (ethersErrorResponse.code === 4001) {
        throw EthereumErrors.CANCELLED_CONNECT_REQUEST;
      } else {
        throw EthereumErrors.UNKNOWN_ERROR;
      }
    }
  }

  private async _updateProvider() {
    // Set Ethereum or throw error
    this._ethereum = await metamaskService.getEthereum();
    if (!this._ethereum) throw EthereumErrors.NO_ETHEREUM;

    // Set Provider or throw error
    // WARNING: cast MetaMaskInpageProvider to ExternalProvider....
    this.provider = new providers.Web3Provider(this._ethereum as ExternalProvider);
    if (!this.provider) throw EthereumErrors.NO_PROVIDER;

    // Set Network and Event to alert if not Ropsten
    this.network = await this.provider.getNetwork();

    // If contract already set, we remove all listeners first
    if (this.contract) this.contract.removeAllListeners();
    this.contract = new Contract(this._contractAddress, this._abi, this.provider);

    this._ethereum.on('chainChanged', this._handleChainChanged);

    // Set accounts
    const accounts: string[] = await this._ethereum.request({
      method: 'eth_accounts',
    });

    this._handleAccountsChanged(accounts);
  }

  private _handleAccountsChanged(accounts: string[]) {
    if (accounts[0] !== this._currentAccount) {
      this._ethereum.on('accountsChanged', this._handleChainChanged);
      this._currentAccount = accounts[0];

      if (this._currentAccount !== null)
        this.userWallet = this.provider && this.provider.getSigner(this._currentAccount);
      if (this.userWallet !== null)
        this.contractRw = new ethers.Contract(this._contractAddress, this._abi, this.userWallet);
    }
  }

  private _handleChainChanged(_chainId: string) {
    EventBus.$emit('logout', true);
    window.location.reload();
  }
}
