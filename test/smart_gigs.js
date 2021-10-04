const SmartGigs = artifacts.require("SmartGigs");
const truffleAssert = require("truffle-assertions");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("SmartGigs", async function(accounts) {
  const gigName = "Test Gig";
  const compensation = 100000000000000000;
  const account1 = accounts[0]; // Gig owner
  const account2 = accounts[1];
  const account3 = accounts[2];
  const account4 = accounts[3];
  const account5 = accounts[4];
  const account6 = accounts[5];
  const account7 = accounts[6];
  const account8 = accounts[7];
  const work = "0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF";

  before(async () => {
    contract = await SmartGigs.deployed();
  });

  it("should not create Gig if minimum compensation is not met", async function() {
    await truffleAssert.reverts(
      contract.createGig.sendTransaction(gigName, 4, {
        from: account1,
        value: compensation - 1000,
      }),
      "Below the required minimum compensation."
    );
  });

  it("should not create Gig if freelancersNumber < 1", async function() {
    await truffleAssert.reverts(
      contract.createGig.sendTransaction(gigName, 0, {
        from: account1,
        value: compensation,
      }),
      "Below the required minimum freelancersNumber."
    );
  });

  it("should create Gig (with event)", async function() {
    await truffleAssert.passes(
      truffleAssert.eventEmitted(
        await contract.createGig.sendTransaction(gigName, 4, {
          from: account1,
          value: compensation,
        }),
        "LogGigStatusChange",
        (ev) => {
          return ev["1"].words[0].toString() === "0";
        }
      )
    );
  });

  it("should create a second Gig", async function() {
    await truffleAssert.passes(
      contract.createGig.sendTransaction(gigName, 10, {
        from: account1,
        value: compensation * 2,
      })
    );
  });

  it("should count 2 Gigs", async function() {
    const gig = await contract.gigsCount();
    await assert.strictEqual(gig.toString(), "2");
  });

  it("should access created Gig", async function() {
    const gig = await contract.gigs(1);
    await assert.strictEqual(gig.name, gigName);
  });

  it("should not be possible to enroll to created Gig as Gig owner", async function() {
    await truffleAssert.reverts(
      contract.enroll(1),
      "You are the gig owner, you can't enroll/submit work."
    );
  });

  it("should be possible to enroll to created Gig from other address (with event)", async function() {
    await truffleAssert.passes(
      truffleAssert.eventEmitted(
        await contract.enroll(1, { from: account2 }),
        "LogEnrolled",
        (ev) => {
          return ev["0"].words[0].toString() === "1";
        }
      )
    );
  });

  it("should not be possible to submit work if Gig status is not valid", async function() {
    await truffleAssert.reverts(
      contract.submitWork(1, work, {
        from: account2,
      }),
      "Gig status is not valid."
    );
  });

  it("should be possible to enroll until gig.freelancersNumber is reached (with event for last one)", async function() {
    await truffleAssert.passes(contract.enroll(1, { from: account3 }));
    await truffleAssert.passes(contract.enroll(1, { from: account4 }));
    await truffleAssert.passes(
      truffleAssert.eventEmitted(
        await contract.enroll(1, { from: account5 }),
        "LogGigStatusChange",
        (ev) => {
          return ev["1"].words[0].toString() === "1";
        }
      )
    );
  });

  it("should not be possible to enroll after gig.freelancersNumber is reached", async function() {
    await truffleAssert.reverts(
      contract.enroll(1, { from: account6 }),
      "You can't enroll to this gig."
    );
  });

  it("should list enrolled freelancers", async function() {
    const result = await contract.isEnrolled(1, { from: account2 });
    assert.strictEqual(result, true);
  });

  it("should not list non enrolled freelancers", async function() {
    const result = await contract.isEnrolled(1, { from: account7 });
    assert.strictEqual(result, false);
  });

  it("should not be possible to submit work if gig owner", async function() {
    await truffleAssert.reverts(
      contract.submitWork(1, work),
      "You are the gig owner, you can't enroll/submit work."
    );
  });

  it("should not be possible to submit work if not enrolled", async function() {
    await truffleAssert.reverts(
      contract.submitWork(1, work, {
        from: account7,
      }),
      "You're not enrolled to this gig."
    );
  });

  it("should not be possible to award work if not all freelancers have submit their work", async function() {
    await truffleAssert.reverts(
      contract.awardTo(1, account2),
      "Gig status is not valid."
    );
  });

  it("should be possible to submit work if enrolled (with event)", async function() {
    await truffleAssert.passes(
      truffleAssert.eventEmitted(
        await contract.submitWork(1, work, { from: account2 }),
        "LogWorkSubmitted",
        (ev) => {
          return ev["0"].words[0].toString() === "1";
        }
      )
    );
  });

  it("should not be possible to submit work if already submitted", async function() {
    await truffleAssert.reverts(
      contract.submitWork(1, work, { from: account2 }),
      "You've already submit your work to this gig."
    );
  });

  it("should have gig status set to 1 (Status.open) if not all enrolled have submitted work", async function() {
    const result = await contract.gigs(1);
    assert.strictEqual(result.status.toString(), "1");
  });

  it("should have gig status set to 2 (Status.review) if all enrolled have submitted work (with event)", async function() {
    await contract.submitWork(1, work, { from: account3 });
    await contract.submitWork(1, work, { from: account4 });
    await truffleAssert.passes(
      truffleAssert.eventEmitted(
        await contract.submitWork(1, work, { from: account5 }),
        "LogGigStatusChange",
        (ev) => {
          return ev["1"].words[0].toString() === "2";
        }
      )
    );
    const result = await contract.gigs(1);
    assert.strictEqual(result.status.toString(), "2");
  });

  it("should not be possible to award work if not gig owner", async function() {
    await truffleAssert.reverts(
      contract.awardTo(1, account2, { from: account8 }),
      "You are not the gig owner."
    );
  });

  it("should be possible to award work (with event), and compensation paid to freelancer", async function() {
    const balanceBefore = await web3.eth.getBalance(account2);
    await truffleAssert.passes(
      truffleAssert.eventEmitted(
        await contract.awardTo(1, account2),
        "LogGigStatusChange",
        (ev) => {
          return ev["1"].words[0].toString() === "3";
        }
      )
    );
    const balanceAfter = await web3.eth.getBalance(account2);
    const paid = balanceAfter - balanceBefore;
    assert.strictEqual(paid.toString(), compensation.toString());
  });

  it("should show awarded freelancer", async function() {
    const result = await contract.gigs(1);
    assert.strictEqual(result.awardedTo.toString(), account2);
  });
});
