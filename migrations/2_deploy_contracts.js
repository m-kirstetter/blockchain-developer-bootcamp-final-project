/* eslint-disable no-undef */
const SmarterContract = artifacts.require('./SmarterContract.sol');
const SmarterContractFactory = artifacts.require('./SmarterContractFactory.sol');

module.exports = function (deployer) {
  deployer.deploy(SmarterContract).then(() => deployer.deploy(SmarterContractFactory, SmarterContract.address));
};
