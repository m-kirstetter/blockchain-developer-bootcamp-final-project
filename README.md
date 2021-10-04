# blockchain-developer-bootcamp-final-project

## Final project idea

Description: A freelance smart contract development dApp marketplace where recruiters can post smart contract development gigs and contractor apply to, and get paid for work.
Recruiter would see full historical work from applicant's wallet address.
To save gas, only gig hash would be stored on Ethereum blockchain.
Recruiter can choose how many freelancers can apply.
Gig amount is transferred and locked in smart contract at ad creation and need to be released by gig owner by selecting best freelancer work.

dApp will have 2 roles:

- Recruiter - can: create edit and delete gigs, accept work from either freelancers (with review) to release funds
- Freelancer - can: browse, apply to gigs (contract interaction) and get paid after work is accepted by recruiter

App workflow:

1. Recruiter creates gig (fields: name, # of freelances are allowed to apply) and transfer minimum of 0.1 ETH as compensation
2. Freelancers can apply, until # of freelances chosen by recruiter is reached
3. Freelancers submit work (all need to submit work)

## Tech stack

Smart contract coded with Solidity and Truffle, test covered.
Frontend is build with Nuxt.js, test covered.

## Initial setup

```bash
# install dependencies
$ npm install
```

## Run contract tests

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

# migrating (or Deploying) contract
$ truffle develop
$ truffle(develop)> migrate
```

## Nuxt.js build setup

```bash
# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## TODO

- Frontend
- Either store full gig on IPFS or hash gig content as ID
- Add feature to prove deployed contract (testnet) is really from enrolled freelancer (owner address same as freelancer address or custom function on deployed contract, etc)
- Optimise for gas
- Refactor functions
- Add features
