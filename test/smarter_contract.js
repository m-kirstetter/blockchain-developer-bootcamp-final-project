/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
const SmarterContract = artifacts.require('SmarterContract');
const SmarterContractFactory = artifacts.require('SmarterContractFactory');
const truffleAssert = require('truffle-assertions');
const truffleEvent = require('truffle-events');
const BN = require('bn.js');

contract('SmarterContract', (accounts) => {
  it('should assert true', async function () {
    await SmarterContract.deployed();
    await SmarterContractFactory.deployed();
    return assert.isTrue(true);
  });

  let contractFactory;
  let implementation;
  let contractAddress;

  const account1 = accounts[0];
  const account2 = accounts[1];
  const account3 = accounts[2];
  const account4 = accounts[3];
  const account5 = accounts[4];
  const account6 = accounts[5];
  const account7 = accounts[6];
  const account8 = accounts[7];

  const milestones = ['10000000000', '10000000000', '10000000000'];
  const wrongMilestones = ['20000000000', '10000000002', '1000000000000'];

  before(async () => {
    contractFactory = await SmarterContractFactory.deployed();
    implementation = await SmarterContract.deployed();
  });

  it('should create a new instance of SmarterContract', async function () {
    await truffleAssert.passes(
      contractFactory.create(account1, account2, milestones, {
        from: account1,
      }),
    );
  });

  it('should fire LogNewContract event on new instance of SmarterContract created', async function () {
    const result = await contractFactory.create(account1, account2, milestones, {
      from: account1,
    });

    truffleAssert.eventEmitted(result, 'LogNewContract', async (event) => {
      contractAddress = event.contractAddress;
      const contract = await SmarterContract.at(contractAddress);
      const mappedEventMilestones = event.milestones.map((milestone) => milestone.toString());
      // const mappedMilestones = milestones.map((milestone) => milestone.toString());
      let checkMilestones = true;
      mappedEventMilestones.forEach((milestone, index) => {
        if (checkMilestones && milestone !== milestones[index]) checkMilestones = false;
      });
      return event.index.toString() === '1' && web3.utils.isAddress(event.contractAddress) && checkMilestones;
    });

    // Check with wrong milestones data
    truffleAssert.eventEmitted(result, 'LogNewContract', (event) => {
      const mappedEventMilestones = event.milestones.map((milestone) => milestone.toString());
      // const mappedMilestones = wrongMilestones.map((milestone) => milestone.toString());
      let checkMilestones = true;
      mappedEventMilestones.forEach((milestone, index) => {
        if (checkMilestones && milestone !== wrongMilestones[index]) checkMilestones = false;
      });
      return !checkMilestones;
    });
  });

  it('should revert if trying to release milestone without having deposit', async function () {
    const contract = await SmarterContract.at(contractAddress);
    await truffleAssert.reverts(contract.release(0), "Can't release any milestone. Have you deposit funds?");
  });

  it('should update balance on deposit', async function () {
    const contract = await SmarterContract.at(contractAddress);
    const value = '30000000000';
    const contractBalanceBefore = await web3.eth.getBalance(contractAddress);
    await truffleAssert.passes(contract.sendTransaction({ from: account1, value }));
    const contractBalanceAfter = await web3.eth.getBalance(contractAddress);
    const total = await contract.total();
    const received = contractBalanceAfter - contractBalanceBefore;
    assert.strictEqual(received.toString(), value);
    assert.strictEqual(total.toString(), value);
  });

  it('should revert if deposit from address that is not Client', async function () {
    const contract = await SmarterContract.at(contractAddress);
    const value = '30000000000';
    await truffleAssert.reverts(contract.sendTransaction({ from: account5, value }), 'You are not contract Client');
  });

  it('should revert if deposit is below total contract amount', async function () {
    const contract = await SmarterContract.at(contractAddress);
    const value = '10000000000';
    await truffleAssert.reverts(
      contract.sendTransaction({ from: account1, value }),
      'Deposit too low, minimum deposit is total contract amount',
    );
  });

  it('should fire Received event on deposit', async function () {
    const contract = await SmarterContract.at(contractAddress);
    const value = '30000000000';
    const result = await contract.sendTransaction({ from: account1, value });
    truffleAssert.eventEmitted(result, 'Received', (event) => {
      return event.amount.toString() === value.toString();
    });
  });

  it('should revert if release from address that is not Client', async function () {
    const contract = await SmarterContract.at(contractAddress);
    await truffleAssert.reverts(contract.release.call(0, { from: account5 }), 'You are not contract Client');
  });

  it('should revert if trying to release not current milestone', async function () {
    const contract = await SmarterContract.at(contractAddress);
    await truffleAssert.reverts(
      contract.release.call(1),
      'Invalid milestone: this is not the current milestone to release',
    );
  });

  it('should pass at next milestone release, and pay milestoe to provider', async function () {
    const contract = await SmarterContract.at(contractAddress);
    const milestoneToRelease = 0;
    const amountToBePaid = milestones[milestoneToRelease];

    const providerBalanceBefore = await web3.eth.getBalance(account2);
    const providerBalanceBeforeBN = new BN(providerBalanceBefore);

    const contractBalanceBefore = await web3.eth.getBalance(contractAddress);
    const contractBalanceBeforeBN = new BN(contractBalanceBefore);

    await truffleAssert.passes(contract.release(0));

    const providerBalanceAfter = await web3.eth.getBalance(account2);
    const providerBalanceAfterBN = new BN(providerBalanceAfter);

    const contractBalanceAfter = await web3.eth.getBalance(contractAddress);
    const contractBalanceAfterBN = new BN(contractBalanceAfter);

    const paidAmount = contractBalanceBeforeBN.sub(contractBalanceAfterBN);
    const receivedAmount = providerBalanceAfterBN.sub(providerBalanceBeforeBN);

    assert.strictEqual(paidAmount.toString(), amountToBePaid.toString());
    assert.strictEqual(receivedAmount.toString(), amountToBePaid.toString());
  });

  it('should pass at next milestone release until last one', async function () {
    const contract = await SmarterContract.at(contractAddress);
    let currentMilestone = parseInt((await contract.currentMilestone()).toString());
    const milestonesListLength = parseInt((await contract.milestonesListLength()).toString());

    let amountToBePaid = 0;

    const loop = milestonesListLength - currentMilestone;

    for (let i = 0; i < loop; i++) {
      if (i >= currentMilestone) {
        amountToBePaid = amountToBePaid + parseInt((await contract.milestones(i)).toString());
      }
    }

    const contractBalanceBefore = await web3.eth.getBalance(contractAddress);
    const contractBalanceBeforeBN = new BN(contractBalanceBefore);

    for (let i = 0; i < loop; i++) {
      if (i >= currentMilestone) {
        await truffleAssert.passes(contract.release(currentMilestone));
        currentMilestone = currentMilestone + 1;
      }
    }

    const contractBalanceAfter = await web3.eth.getBalance(contractAddress);
    const contractBalanceAfterBN = new BN(contractBalanceAfter);

    const paidAmount = contractBalanceBeforeBN.sub(contractBalanceAfterBN);

    assert.strictEqual(paidAmount.toString(), amountToBePaid.toString());
  });
});
