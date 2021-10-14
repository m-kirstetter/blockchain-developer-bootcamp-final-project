export const PROVIDER_CHECK_MS: number = 500;

export const ENS_NETS: string[] = ["0x1", "0x3", "0x4"];

export const EVENT_CHANNEL: string = "ethers";

export const ERRORS: { [key: string]: string } = {
  ///////////////////
  // Generic Errors

  // Unknown Error
  UNKNOWN_ERROR: "Unknown Error",

  // Not Implemented
  NOT_IMPLEMENTED: "Not Implemented",

  // Unsupported Operation
  //   - operation
  UNSUPPORTED_OPERATION: "Unsupported Operation",

  // Network Error (i.e. Ethereum Network, such as an invalid chain ID)
  //   - event ("noNetwork" is not re-thrown in provider.ready; otherwise thrown)
  NETWORK_ERROR: "Network Error",

  // Some sort of bad response from the server
  SERVER_ERROR: "Server Error",

  // Timeout
  TIMEOUT: "Timeout",

  ///////////////////
  // Operational  Errors

  // Buffer Overrun
  BUFFER_OVERRUN: "Buffer Overrun",

  // Numeric Fault
  //   - operation: the operation being executed
  //   - fault: the reason this faulted
  NUMERIC_FAULT: "Numeric Fault",

  ///////////////////
  // Argument Errors

  // Missing new operator to an object
  //  - name: The name of the class
  MISSING_NEW: "Missing New",

  // Invalid argument (e.g. value is incompatible with type) to a function:
  //   - argument: The argument name that was invalid
  //   - value: The value of the argument
  INVALID_ARGUMENT: "Invalid Argument",

  // Missing argument to a function:
  //   - count: The number of arguments received
  //   - expectedCount: The number of arguments expected
  MISSING_ARGUMENT: "Missing Argument",

  // Too many arguments
  //   - count: The number of arguments received
  //   - expectedCount: The number of arguments expected
  UNEXPECTED_ARGUMENT: "Unexpected Argument",

  ///////////////////
  // Blockchain Errors

  // Call exception
  //  - transaction: the transaction
  //  - address?: the contract address
  //  - args?: The arguments passed into the function
  //  - method?: The Solidity method signature
  //  - errorSignature?: The EIP848 error signature
  //  - errorArgs?: The EIP848 error parameters
  //  - reason: The reason (only for EIP848 "Error(string)")
  CALL_EXCEPTION: "Call Exception",

  // Insufficien funds (< value + gasLimit * gasPrice)
  //   - transaction: the transaction attempted
  INSUFFICIENT_FUNDS: "Insufficient Funds",

  // Nonce has already been used
  //   - transaction: the transaction attempted
  NONCE_EXPIRED: "Nonce Expired",

  // The replacement fee for the transaction is too low
  //   - transaction: the transaction attempted
  REPLACEMENT_UNDERPRICED: "Replacement Underpriced",

  // The gas limit could not be estimated
  //   - transaction: the transaction passed to estimateGas
  UNPREDICTABLE_GAS_LIMIT: "Unpredictable Gas Limit",

  // The transaction was replaced by one with a higher gas price
  //   - reason: "cancelled", "replaced" or "repriced"
  //   - cancelled: true if reason == "cancelled" or reason == "replaced")
  //   - hash: original transaction hash
  //   - replacement: the full TransactionsResponse for the replacement
  //   - receipt: the receipt of the replacement
  TRANSACTION_REPLACED: "Transaction Replaced",

  "4001": "You have cancelled the transaction, please retry."
};
