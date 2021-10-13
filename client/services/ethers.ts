/* eslint-disable */
// @TODO: type correctly
import Vue from "vue";
import {
  providers,
  Contract as ContractModule,
  utils as utilsModule,
  ethers
} from "ethers";
import { EthersMessages } from "~/enums/ethers-messages";
import {
  PROVIDER_CHECK_MS,
  ENS_NETS,
  EVENT_CHANNEL
} from "~/constants/ethers.constant";
import abi from "./contracts_SmartGigs_sol_SmartGigs.json";

declare let window: any;

let contractAddress: string;
if (process.env.NUXT_ENV_CONTRACT) {
  contractAddress = process.env.NUXT_ENV_CONTRACT;
} else {
  throw new Error("NUXT_ENV_CONTRACT environment variable is not set");
}

// use vue as a simple event channel
export const event = new Vue();
// expose ethers modules
export const utils = utilsModule;
export const Contract = ContractModule;

// for ethers
let ethereum: any;
let provider: any;
let contract: any;
let contract_rw: any;
let chainId: any;
let userWallet: any;
let currentAccount: any;
let providerInterval: any;
let initialized: boolean;

function getEthereum(): any {
  return window.ethereum;
}

function ethereumOk(): any {
  const em = getEthereum();
  return em && em.isConnected();
}

// get the name of this network
export async function getNetName(): Promise<string> {
  switch (chainId as any) {
    case "0x1":
      return "Mainnet";
    case "0x2":
      return "Morden (deprecated)";
    case "0x3":
      return "Ropsten Test Network";
    case "0x4":
      return "Rinkeby Test Network";
    case "0x5":
      return "Goerli Test Network";
    case "0x2a":
      return "Kovan Test Network";
    case undefined:
    case null:
      return "No Chain!";
    // if you give your ganache an id your can detect it here if you want
    default:
      return "Unknown";
  }
}

// if this net has ens
export async function hasEns(): Promise<boolean> {
  return ENS_NETS.includes(chainId);
}

// get deployed address for a contract from its networks object and current network id or null
export async function getNetworkAddress(networks: any) {
  if (!networks[chainId] || !networks[chainId].address) return null;
  return networks[chainId].address;
}

export function getProvider() {
  return provider;
}

export function getContract() {
  return contract;
}

export function getContractRw() {
  return contract_rw;
}

export function getWallet() {
  return userWallet;
}

export async function getWalletAddress(): Promise<string> {
  const addr = userWallet && (await userWallet.getAddress());
  return addr;
}

export function ready(): boolean {
  return !!provider && !!userWallet;
}

export async function startProviderWatcher(): Promise<void> {
  // this should only be run when a ethereum provider is detected and set at the ethereum value above
  async function updateProvider(): Promise<void> {
    try {
      ethereum = getEthereum();
      if (!ethereum) return;
      // set ethers provider
      provider = new providers.Web3Provider(ethereum);
      initialized = true;

      // first reset all listeners
      if (contract) contract.removeAllListeners();

      // set contract & event listeners
      contract = new ethers.Contract(contractAddress, abi, provider);

      contract.on(
        "LogGigStatusChange",
        async (gigId: number, status: string): Promise<void> => {
          event.$emit("LogGigStatusChange", {
            gigId: gigId.toString(),
            status
          });
        }
      );

      contract.on(
        "LogEnrolled",
        async (gigId: number): Promise<void> => {
          event.$emit("LogEnrolled", { gigId: gigId.toString() });
        }
      );

      contract.on(
        "LogWorkSubmitted",
        async (gigId: number): Promise<void> => {
          event.$emit("LogWorkSubmitted", { gigId: gigId.toString() });
        }
      );

      /**********************************************************/
      /* Handle chain (network) and chainChanged (per EIP-1193) */
      /**********************************************************/

      // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
      // returns incorrectly formatted chain ID values.
      chainId = ethereum.chainId;

      ethereum.on("chainChanged", handleChainChanged);

      /***********************************************************/
      /* Handle user accounts and accountsChanged (per EIP-1193) */
      /***********************************************************/

      const accounts = await ethereum.request({ method: "eth_accounts" });
      await handleAccountsChanged(accounts);
      ethereum.on("accountsChanged", handleAccountsChanged);
    } catch (err) {
      // console.error("Error requesting ethereum accounts", err);
      event.$emit(EVENT_CHANNEL, EthersMessages.NO_WALLET);
    }
  }

  function checkProvider() {
    // handle changes of availability of ethereum provider
    if (ethereum && !ethereumOk()) {
      ethereum = null;
      provider = null;
      chainId = null;
      currentAccount = null;
      userWallet = null;
      event.$emit(EVENT_CHANNEL, EthersMessages.NOT_READY);
    } else if (!ethereum && ethereumOk()) {
      updateProvider();
    }
  }

  // kick it off now
  checkProvider();
  // and set interval
  providerInterval = setInterval(checkProvider, PROVIDER_CHECK_MS);
}

function handleChainChanged(_chainId: any) {
  chainId = _chainId;
  window.location.reload();
}

function handleAccountsChanged(accounts: any) {
  if (accounts.length === 0) {
    // console.log("No ethereum accounts available");
    event.$emit(EVENT_CHANNEL, EthersMessages.NO_WALLET);
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    userWallet = provider && provider.getSigner(currentAccount);
    contract_rw = new ethers.Contract(contractAddress, abi, userWallet);
    event.$emit(EVENT_CHANNEL, EthersMessages.ACCOUNT_CHANGED);
  }
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

export async function connect() {
  try {
    if (!ethereum)
      return event.$emit(EVENT_CHANNEL, EthersMessages.NOT_CONNECTED);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    handleAccountsChanged(accounts);
    event.$emit(EVENT_CHANNEL, EthersMessages.ACCOUNT_CHANGED);
  } catch (err) {
    event.$emit(EVENT_CHANNEL, EthersMessages.NOT_READY, err);
  }
}

// stop interval looking for ethereum provider changes
export async function stopWatchProvider() {
  if (providerInterval) clearInterval(providerInterval);
  providerInterval = null;
}

// start ethereum provider checker, only on client side
if (process.client) {
  startProviderWatcher();
}

export default {
  connect,
  ethereumOk,
  getNetName,
  hasEns,
  getProvider,
  getContract,
  getContractRw,
  getWallet,
  getWalletAddress,
  getNetworkAddress,
  ready
};
