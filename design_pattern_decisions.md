## Design pattern decisions

1. I used the Factory Pattern to generate a smart contract for each 'gig contract' created. It consist of a factory contract that is used to generate a new contract by using openzeppeling proxy Clones.sol contract (it reduces generated contract size as it forwards all calls to another implementation contract, see https://eips.ethereum.org/EIPS/eip-1167)
2. I used an interface for both SmarterContract and SmarterContractFactory
3. Protection for proxy contracts initializing function (so it is callable only once). The protection is using openzeppelin proxy utils Initializable.sol contract
