/* eslint no-unused-vars: 0 */

export enum EthereumErrors {
  NO_ETHEREUM = 'NO_ETHEREUM',
  NO_PROVIDER = 'NO_PROVIDER',
  NOT_CONNECTED = 'NOT_CONNECTED',
  NOT_READY = 'NOT_READY',
  NO_CONTRACT = 'NO_CONTRACT',
  NO_WALLET = 'NO_WALLET',
  ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
  ETHERS_VUEX_INITIALIZED = 'ETHERS_VUEX_INITIALIZED',
  ETHERS_VUEX_READY = 'ETHERS_VUEX_READY',
  NOT_ROPSTEN = 'NOT_ROPSTEN',
  NOT_METAMASK = 'NOT_METAMASK',
  NOT_SIGNED = 'NOT_SIGNED',
  CANCELLED_CONNECT_REQUEST = 'CANCELLED_CONNECT_REQUEST',
  SIGNED_IN = 'SIGNED_IN',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export enum EthereumErrorMessages {
  NO_ETHEREUM = 'Ethereum not detected.',
  NO_PROVIDER = 'No provider detected',
  NOT_CONNECTED = 'Not connected to Ethereum network.',
  NOT_READY = 'Ethereum network not ready.',
  NO_CONTRACT = 'Contract environment variable is not set',
  NO_WALLET = 'No Ethereum wallet detected.',
  ACCOUNT_CHANGED = 'Ethereum account changed.',
  ETHERS_VUEX_INITIALIZED = 'Ethers vuex module initialized.',
  ETHERS_VUEX_READY = 'Ethers vuex module ready.',
  NOT_ROPSTEN = 'Wrong chain, please connect to Ropsten.',
  NOT_METAMASK = 'Please install Metamask!',
  NOT_SIGNED = 'You did not sign the message, please try again.',
  CANCELLED_CONNECT_REQUEST = 'You cancelled connection request, please try again.',
  SIGNED_IN = "You're now connected",
  UNKNOWN_ERROR = 'Unknown error.',
}
