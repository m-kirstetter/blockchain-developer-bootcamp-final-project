/* eslint-disable */
import Vue from "vue";
import {
  providers,
  Contract as ContractModule,
  utils as utilsModule,
  ethers,
} from "ethers";
import abi from "../../utils/contracts_SmartGigs_sol_SmartGigs.json";

// ropsten: 0xdc5E511D15c7b06De7A423627a716C5D11C621Ef
const contractAddress = process.env.NUXT_ENV_CONTRACT;

export const PROVIDER_CHECK_MS = 500;
// networks where ens exists
// Mainet, Ropsten, Ropsten
export const ENS_NETS = ["0x1", "0x3", "0x4"];

// messages
export const MSGS = {
  NOT_CONNECTED: "Not connected to Ethereum network",
  NOT_READY: "Ethereum network not ready",
  NO_WALLET: "No Ethereum wallet detected",
  ACCOUNT_CHANGED: "Ethereum account changed",
  ETHERS_VUEX_INITIALIZED: "Ethers vuex module initialized",
  ETHERS_VUEX_READY: "Ethers vuex module ready",
};
export const EVENT_CHANNEL = "ethers";
// use vue as a simple event channel
export const event = new Vue();
// expose ethers modules
export const utils = utilsModule;
export const Contract = ContractModule;

// ethereum transactions to log
// More information: https://docs.ethers.io/ethers.js/html/api-providers.html#events
// export const LOG_TRANSACTIONS = [
//   "block",
// can also be an address or transaction hash
// [] // list of topics, empty for all topics
// ];

// for ethers
let ethereum;
let provider;
let contract;
let contract_rw;
let chainId;
let userWallet;
let currentAccount;
let providerInterval;
let initialized;

function getEthereum() {
  return window.ethereum;
}

function ethereumOk() {
  const em = getEthereum();
  return em && em.isConnected();
}

// get the name of this network
export async function getNetName() {
  switch (chainId) {
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
export async function hasEns() {
  return ENS_NETS.includes(chainId);
}

// get deployed address for a contract from its networks object and current network id or null
export async function getNetworkAddress(networks) {
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

export async function getWalletAddress() {
  const addr = userWallet && (await userWallet.getAddress());
  return addr;
}

export function ready() {
  return !!provider && !!userWallet;
}

export async function startProviderWatcher() {
  // this should only be run when a ethereum provider is detected and set at the ethereum value above
  async function updateProvider() {
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

      contract.on("LogGigStatusChange", async (gigId, status, data) => {
        if (await fireEvent(data.blockNumber)) {
          event.$emit("LogGigStatusChange", {
            gigId: gigId.toString(),
            status,
          });
        }
      });

      contract.on("LogEnrolled", async (gigId, data) => {
        if (await fireEvent(data.blockNumber)) {
          event.$emit("LogEnrolled", { gigId: gigId.toString() });
        }
      });

      contract.on("LogWorkSubmitted", async (gigId, data) => {
        if (await fireEvent(data.blockNumber)) {
          event.$emit("LogWorkSubmitted", { gigId: gigId.toString() });
        }
      });

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
      event.$emit(EVENT_CHANNEL, MSGS.NO_WALLET);
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
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY);
    } else if (!ethereum && ethereumOk()) {
      updateProvider();
    }
  }

  // kick it off now
  checkProvider();
  // and set interval
  providerInterval = setInterval(checkProvider, PROVIDER_CHECK_MS);
}

function handleChainChanged(_chainId) {
  chainId = _chainId;
  window.location.reload();
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // console.log("No ethereum accounts available");
    event.$emit(EVENT_CHANNEL, MSGS.NO_WALLET);
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    userWallet = provider && provider.getSigner(currentAccount);
    contract_rw = new ethers.Contract(contractAddress, abi, userWallet);
    event.$emit(EVENT_CHANNEL, MSGS.ACCOUNT_CHANGED);
  }
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

export async function connect() {
  try {
    if (!ethereum) return event.$emit(EVENT_CHANNEL, MSGS.NOT_CONNECTED);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await handleAccountsChanged(accounts);
    await event.$emit(EVENT_CHANNEL, MSGS.ACCOUNT_CHANGED);
  } catch (err) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY, err);
    } else {
      // console.error("Error requesting Ethereum connection/accounts", err);
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY, err);
    }
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

// To check if event timestamp is more than 20 seconds from now
async function fireEvent(blockNumber) {
  const block = await provider.getBlock(blockNumber);
  const timestamp = block.timestamp;
  // Date.now() conversion to seconds insteads of milliseconds
  const now = Math.floor(Date.now() / 1000);
  // return timestamp + 30 > now ? true : false;
  return true;
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
  ready,
};
