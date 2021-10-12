# blockchain-developer-bootcamp-final-project

[![Netlify Status](https://api.netlify.com/api/v1/badges/5ab45611-764f-4059-8b07-5b20f92cdff3/deploy-status)](https://app.netlify.com/sites/flamboyant-booth-468ae4/deploys)

## Final project idea

Description: A freelance smart contract development dApp marketplace where recruiters can post smart contract development gigs and contractor apply to, and get paid for work.
Recruiter would see full historical work from applicant's wallet address.
To save gas, only gig hash would be stored on Ethereum blockchain.
Recruiter can choose how many freelancers can apply, and award work after all freelancers submitted their work.
Gig amount is transferred and locked in smart contract at gig creation and need to be released by gig owner by selecting best freelancer work.

dApp will have 2 roles:

- Recruiter - can: create edit and delete gigs, accept work from either freelancers (with review) to release funds
- Freelancer - can: browse, apply to gigs (contract interaction) and get paid after work is accepted by recruiter

dApp workflow:

1. Recruiter creates gig (fields: name, # of freelances are allowed to apply) and transfer minimum of 0.1 ETH as compensation
2. Freelancers can apply, until # of freelances chosen by recruiter is reached
3. Freelancers submit work (all need to submit work)
4. Recruiter reviews and award one freelancer's work (has to)
5. Funds are released to winning freelancer

## Tech stack

Smart contract coded with Solidity and Truffle, test covered.
Frontend is build with Nuxt.js, test covered.

## Initial setup

```bash
# install dependencies
$ npm install -g truffle
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

# generate ABI
$ solcjs --abi contracts/SmartGigs.sol
$ mv contracts_SmartGigs_sol_SmartGigs.abi client/util
$ mv client/utils/contracts_SmartGigs_sol_SmartGigs.abi client/utils/contracts_SmartGigs_sol_SmartGigs.json
```

## Nuxt.js build setup

```bash
# add deployed contract address in .env file
$ nano client/.env
CONTRACT=address_of_your_deployed_contract

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## TODO/IDEAS

- Dev work award feature (but I might actually update project and go for spmething more conventional like upwork etc. Where recruiter post gig, freelancers apply with price, recruiter choose one freelancer)
- Add feature to prove deployed contract (testnet) is really from enrolled freelancer (owner address same as freelancer address or custom function on deployed contract, etc)
- See to split payment (80% for winning freelancer, 20% split between remaining freelancers)
- See how to deal with ETH in edge cases (no one or not enough freelancers applied, recruiter never reviews, etc..)
- Optimise for gas
- Refactor smart contract functions to use Library etc
- Add features
