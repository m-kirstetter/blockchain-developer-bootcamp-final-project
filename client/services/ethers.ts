// NOTE: Metamask 'ethereum' can't be properly typed, all is excluded from ts-coverage
import { providers, Contract, ethers, BigNumber, errors } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { EthersMessages } from "~/enums/ethers-messages";
import { EthersErrorResponse } from "~/interfaces/ethers";
import {
  Network,
  getNetwork as getEthersNetwork
} from "@ethersproject/networks";
import { PROVIDER_CHECK_MS, ENS_NETS } from "~/constants/ethers.constant";
import abi from "./contracts_SmartGigs_sol_SmartGigs.json";
import { EventBus } from "~/plugins/event-bus";
import { BootstrapVariant } from "~/enums/bootstrap-variant";
import { GIG_STATUS_MAPPING } from "~/constants/gig-status.constant";

let contractAddress: string;
if (process.env.NUXT_ENV_CONTRACT) {
  contractAddress = process.env.NUXT_ENV_CONTRACT;
} else {
  throw new Error("NUXT_ENV_CONTRACT environment variable is not set");
}

// for ethers
// type-coverage:ignore-next-line
let ethereum: any;
let provider: JsonRpcProvider | null;
let contract: Contract | null;
let contract_rw: Contract | null;
let network: Network | null;
let userWallet: JsonRpcSigner | null;
let currentAccount: string | null;
let providerInterval: NodeJS.Timeout | null;
let initialized: boolean;

async function detectEthereum(): Promise<boolean> {
  // type-coverage:ignore-next-line
  const ethereum = await detectEthereumProvider();
  // type-coverage:ignore-next-line
  return ethereum ? true : false;
}

// type-coverage:ignore-next-line
async function getEthereum(): Promise<any> {
  // type-coverage:ignore-next-line
  const ethereum = await (window as any).ethereum;
  // type-coverage:ignore-next-line
  return ethereum ?? null;
}

export function getNetwork(): Network | null {
  return network;
}

// if this net has ens
export function hasEns(): boolean {
  return network?.chainId ? ENS_NETS.includes(network?.chainId) : false;
}

export function getProvider(): JsonRpcProvider | null {
  return provider;
}

export function getContract(): Contract | null {
  return contract;
}

export function getContractRw(): Contract | null {
  return contract_rw;
}

export function getWallet(): JsonRpcSigner | null {
  return userWallet;
}

export async function getWalletAddress(): Promise<string | null> {
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
      // type-coverage:ignore-next-line
      ethereum = await getEthereum();

      // type-coverage:ignore-next-line
      if (!ethereum) return;

      // set ethers provider
      // type-coverage:ignore-next-line
      provider = new providers.Web3Provider(ethereum);
      initialized = true;

      const { chainId } = await provider.getNetwork();
      network = getEthersNetwork(chainId);

      // first reset all listeners from former contract and grab new contract
      if (contract) contract.removeAllListeners();
      contract = new Contract(contractAddress, abi, provider);

      // set contract event listeners
      contract.on(
        "LogGigStatusChange",
        async (gigId: BigNumber, status: number): Promise<void> => {
          EventBus.$emit("GetGigs");
          if (status === 0) {
            EventBus.$emit("Toast", {
              variant: BootstrapVariant.SUCCESS,
              text: `Gig #${gigId} has been created`,
              title: "Success"
            });
          } else {
            EventBus.$emit("Toast", {
              variant: BootstrapVariant.WARNING,
              text: `Gig #${gigId} is now status '${GIG_STATUS_MAPPING[status]}'`,
              title: "Status change"
            });
          }
        }
      );

      contract.on(
        "LogEnrolled",
        async (gigId: BigNumber): Promise<void> => {
          EventBus.$emit("GetGigs");
          EventBus.$emit("Toast", {
            variant: BootstrapVariant.SUCCESS,
            text: `Your are now enrolled to Gig #${gigId}`,
            title: "Enrolled"
          });
        }
      );

      contract.on(
        "LogWorkSubmitted",
        async (gigId: BigNumber): Promise<void> => {
          EventBus.$emit("GetGigs");
          EventBus.$emit("Toast", {
            variant: BootstrapVariant.SUCCESS,
            text: `Your work has been submitted to Gig #${gigId.toNumber()}`,
            title: "Work submitted"
          });
        }
      );

      /**********************************************************/
      /* Handle chain (network) and chainChanged (per EIP-1193) */
      /**********************************************************/

      // type-coverage:ignore-next-line
      ethereum.on("chainChanged", handleChainChanged);

      /***********************************************************/
      /* Handle user accounts and accountsChanged (per EIP-1193) */
      /***********************************************************/

      // type-coverage:ignore-next-line
      const accounts: string[] = await ethereum.request({
        method: "eth_accounts"
      });

      await handleAccountsChanged(accounts);

      // type-coverage:ignore-next-line
      ethereum.on("accountsChanged", handleAccountsChanged);
    } catch (error) {
      // console.error("Error requesting ethereum accounts", error);
      EventBus.$emit("Ethers", EthersMessages.NO_WALLET);
      EventBus.$emit("Toast", {
        variant: BootstrapVariant.WARNING,
        text: EthersMessages.NO_WALLET,
        title: "Warning"
      });
    }
  }

  function checkProvider(): void {
    // handle changes of availability of ethereum provider
    // type-coverage:ignore-next-line
    if (ethereum && !detectEthereum()) {
      // type-coverage:ignore-next-line
      ethereum = null;
      provider = null;
      network = null;
      currentAccount = null;
      userWallet = null;

      EventBus.$emit("Ethers", EthersMessages.NOT_READY);
      EventBus.$emit("Toast", {
        variant: BootstrapVariant.WARNING,
        text: EthersMessages.NOT_READY,
        title: "Warning"
      });
      // type-coverage:ignore-next-line
    } else if (!ethereum && detectEthereum()) {
      updateProvider();
    }
  }

  // kick it off now
  checkProvider();
  // and set interval
  providerInterval = setInterval(checkProvider, PROVIDER_CHECK_MS);
}

function handleChainChanged(chainId: string): void {
  network = getEthersNetwork(chainId);
  window.location.reload();
}

async function handleAccountsChanged(accounts: string[]): Promise<void> {
  if (accounts.length === 0) {
    EventBus.$emit("Ethers", EthersMessages.NO_WALLET);
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];

    if (currentAccount !== null)
      userWallet = provider && provider.getSigner(currentAccount);

    if (userWallet !== null)
      contract_rw = new ethers.Contract(contractAddress, abi, userWallet);

    EventBus.$emit("Ethers", EthersMessages.ACCOUNT_CHANGED);
  }
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

export async function connect(): Promise<void> {
  try {
    // type-coverage:ignore-next-line
    if (!ethereum) {
      EventBus.$emit("Ethers", EthersMessages.NOT_CONNECTED);

      EventBus.$emit("Toast", {
        variant: BootstrapVariant.DANGER,
        text: EthersMessages.NOT_CONNECTED,
        title: "Error"
      });

      throw new Error(EthersMessages.NOT_CONNECTED);
    }

    // type-coverage:ignore-next-line
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    handleAccountsChanged(accounts);

    EventBus.$emit("Ethers", EthersMessages.ACCOUNT_CHANGED);
  } catch (error) {
    // EventBus.$emit("Ethers", EthersMessages.NOT_READY, error);
    const ethersError = error as EthersErrorResponse;

    // Toast if user did not allow app to access Metamask accounts
    if (ethersError.code === 4001) {
      EventBus.$emit("Ethers", EthersMessages.NOT_SIGNED, error);
      EventBus.$emit("Toast", {
        variant: BootstrapVariant.DANGER,
        text: EthersMessages.NOT_SIGNED,
        title: "Error"
      });
      throw new Error(EthersMessages.NOT_SIGNED);
    } else {
      EventBus.$emit("Ethers", EthersMessages.NOT_READY, error);
      EventBus.$emit("Toast", {
        variant: BootstrapVariant.DANGER,
        text: EthersMessages.NOT_READY,
        title: "Error"
      });
    }
  }
}

// stop interval looking for ethereum provider changes
export function stopWatchProvider(): void {
  if (providerInterval) clearInterval(providerInterval);
  providerInterval = null;
}

// start ethereum provider checker, only on client side
// warning if Metamask not found
// type-coverage:ignore-next-line
if (process.client && typeof (window as any).ethereum !== "undefined") {
  startProviderWatcher();
} else {
  EventBus.$emit("Ethers", EthersMessages.NOT_METAMASK);
  EventBus.$emit("Toast", {
    variant: BootstrapVariant.DANGER,
    text: EthersMessages.NOT_METAMASK,
    title: "Metamask Not Found"
  });
  throw new Error(EthersMessages.NOT_METAMASK);
}

export default {
  connect,
  hasEns,
  getProvider,
  getNetwork,
  getContract,
  getContractRw,
  getWallet,
  getWalletAddress,
  ready
};
