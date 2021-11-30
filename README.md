# blockchain-developer-bootcamp-final-project

Deployed at [Heroku](https://smart-gigs.herokuapp.com/) on Ropsten.

My Ethereum address: 0xb40FadAc1bBD43f24c5Dbd46924dd653bcdFd784

## Final project idea

I thought initially of a smart contract development dApp marketplace. After thinking about implementation, for the purpose of the bootcamp and to have something extendable afterwards, I narrowed the blockchain side idea into a contracting and milestones payment solution called 'Smarter Contract'. For the demo, I built a smart contract development marketplace called 'Smart Gigs' that uses the developed smart contract as some kind of 'Escrow' service and for milestones payments. I tried to have minimal footprint contracts to save gas costs while preserving functionalities. The frontend features a passwordless backend authentication with Metamask.

Metamask authentication workflow:

1. User clic Connect with Metamask button and accepts its Metamask account access
2. User is directly presented with a second Metamask popup asking for a signature, the message to sign contains a uniquely generated nonce
3. If user accepts, message is encrypted using his Metamask private key and sent to the app backend
4. Since backend has the message with the unique nonce and the user public key, it can try to decrypt message signer's wallet address, if the decrypted address corresponds to initial request address, user is identified and logged in.

Gig creation/payment workflow:

1. Recruiter creates gig
2. Freelancers can apply listing milestones and their price
3. Recruiter awards 1 freelancer by sending all required data to a smart contract factory contract, with the full contract amount in ETH. The contract amount is locked until milestones are released. (Smart contract interaction)
4. Recruiter releases the milestone, this automatically triggers milestone payment to provider (Smart contract interaction)
5. 4 repeats until there are no more milestones to be released

## Prerequisities

- Node v14
- Truffle v5
- Solidity v0.8.9
- Metamask wallet connected to Ropsten network

## Directory structure

- contracts - smart contracts and interfaces
- build/contracts - smart contracts build json (abi, etc)
- test - smart contracts tests

- src/api - Express backend API code & mongoose models
- src/services - contains Ethereum & Ethers services
- src/components - contains Vuesion and app components
- src/pages - contains page components
- src/test - contains frontend tests

## Tech stack

- Smart contract is coded with Solidity using Truffle, test covered
- Frontend is built with Vuesion (Nuxt.js), using TypeScript
- Express.js is used for backend API, using TypeScript
- MongoDB is used as database, models implemented with Mongoose using TypeScript

## Design pattern decisions

1. I used the Factory Pattern to generate a smart contract for each 'gig contract' created. It consist of a factory contract that is used to generate a new contract by using openzeppeling proxy Clones.sol contract (it reduces generated contract size as it forwards all calls to another implementation contract, see https://eips.ethereum.org/EIPS/eip-1167)
2. I used an interface for both SmarterContract and SmarterContractFactory
3. Protection for proxy contracts initializing function (so it is callable only once). The protection is using openzeppelin proxy utils Initializable.sol contract

## Avoiding common attacks

1. SWC-134 - Avoid the use of transfer() and send(), and without specifying a fixed amount of gas (see https://swcregistry.io/docs/SWC-134) - in SmarterContract.sol \_transfer function
2. SWC-105 - Controls so withdrawals can only be made to contract provider address (see https://swcregistry.io/docs/SWC-105) - in SmarterContract.sol \_transfer function
3. SWC-107 - Using OpenZeppelin's ReentrancyGuard nonReentrant lock modifier (see https://swcregistry.io/docs/SWC-107) - used in SmarterContract.sol release function
4. Using specific pragma

## Initial setup

```bash
# install dependencies
$ npm install -g truffle
$ npm install
```

## Run smart contracts tests

- development network is configured on port 7545

```bash
# run tests
$ truffle test
```

## Run Nuxt.js tests

```bash
# run tests
$ npm run tests
```

## Contract build setup

```bash
# build artifacts
$ truffle compile

# migrating (or Deploying) contract (abi are in generated json files)
$ truffle develop
$ truffle(develop)> migrate
```

## Nuxt.js build setup

```bash
# add env variables
$ nano .env
add all missing env variables (see .env-example)

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Possible future features

- Add deadline with fund release feature
- Milestone rejection feature
- Aragon Court for dispute resolution
- Tip feature
- Lock feature
- Test SmarterContractFactory more thoroughly

# References

- [vuesion](https://vuesion.herokuapp.com/)
- [nuxt](https://nuxtjs.org/)

# License

- [MIT](http://opensource.org/licenses/MIT)
- Vuesion+ VueDataTable component use is limited to this project, see component's LICENSE.md file
