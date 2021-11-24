## Avoiding commom attacks

1. SWC-134 - Avoid the use of transfer() and send(), and without specifying a fixed amount of gas (see https://swcregistry.io/docs/SWC-134) - in SmarterContract.sol \_transfer function
2. SWC-105 - Controls so withdrawals can only be made to contract provider address (see https://swcregistry.io/docs/SWC-105) - in SmarterContract.sol \_transfer function
3. SWC-107 - Using OpenZeppelin's ReentrancyGuard nonReentrant lock modifier (see https://swcregistry.io/docs/SWC-107) - used in SmarterContract.sol release function
4. Using specific pragma
