var assert = require("assert");
/* var Web3 = require("web3");
var AssemblyContract = require("../src/contracts/Assembly.json");
var SharesContract = require("../src/contracts/Shares.json");
var VotingContract = require("../src/contracts/Voting.json"); */
import lib from "../src/lib";

//var web3 = new Web3(process.env.REACT_APP_PROVIDER);
//var wallet = web3.eth.accounts.wallet;

const WAIT_FOR_BLOCKS = 10000;
const CLIENTS = Number(process.env.CLIENTS ? process.env.CLIENTS : 20);
const MINGAS = lib.web3.utils.toBN(21000 * 100);
const PRIVATEKEY = process.env.TEST_PRIVATEKEY;
const CONTRACT_CREATE_TIME = 120000;
const REGISTRATION_TIME = WAIT_FOR_BLOCKS + CLIENTS * 1000;
const WEB3_QUERY_TIME = 10000;
const VOTING_TIME = 10 + CLIENTS;

lib.wallet.add(PRIVATEKEY);
lib.wallet.create(CLIENTS);

function delay(interval) {
  return it("should delay", (done) => {
    setTimeout(() => done(), interval());
  }).timeout(interval() + 100); // The extra 100ms should guarantee the test will not fail due to exceeded timeout
}

let balanceBefore;
var voting = null;
describe("Wallet initialisation", function () {
  it("accounts have been created", function () {
    assert.equal(lib.wallet.length, CLIENTS + 1);
  });
  it("has ether on the main account", async function () {
    this.timeout(WEB3_QUERY_TIME);
    balanceBefore = lib.web3.utils.toBN(
      await lib.web3.eth.getBalance(lib.wallet[0].address)
    );
    assert.ok(
      balanceBefore.gt(
        lib.web3.utils.toBN(await lib.web3.eth.getGasPrice()).mul(MINGAS)
      )
    );
  });
});

describe("Assembly Preparation", function () {
  it("can deploy new assembly", async function () {
    this.timeout(CONTRACT_CREATE_TIME);
    let assembly = await lib.deployAssembly("TEST RUN ASSEMBLY");
    assert.ok(typeof assembly === "string");
    assert.equal(assembly.length, 42);
  });
  it("can create new voting", async function () {
    this.timeout(CONTRACT_CREATE_TIME);
    voting = await lib.deployVoting("TEST VOTING", "THIS IS A DUMMY QUESTION");
    assert.ok(typeof voting === "string");
    assert.equal(voting.length, 42);
    let votings = await lib.getVotings();
    assert.deepEqual(votings, {
      [voting]: {
        title: "TEST VOTING",
        purpose: "THIS IS A DUMMY QUESTION",
        starttime: "0",
        endtime: "0",
        currenttime: votings[voting].currenttime,
        voters: false,
        closed: false,
        started: false,
        running: false,
      },
    });
  });
});

let shares = [];
describe("Assembly Accredition", function () {
  let secrets = [];
  it("can handle all " + lib.wallet.length + " user registrations", function (
    done
  ) {
    this.timeout(REGISTRATION_TIME);
    let terminated = 0;
    let success = () => {
      if (++terminated === lib.wallet.length) done();
    };
    let error = (err) => done(err);
    for (let i = 0; i < lib.wallet.length; ++i) {
      secrets[i] = Math.random().toString(36).substring(7);
      lib.register(secrets[i], success, error, i);
    }
  });
  it("has all " + lib.wallet.length + " users registered", function (done) {
    this.timeout(REGISTRATION_TIME);
    let terminated = 0;
    let success = () => {
      if (++terminated === lib.wallet.length) done();
    };
    let error = (err) => done(err);
    for (let i = 0; i < lib.wallet.length; ++i)
      lib
        .checkRegistrationStatus(i)
        .then((secret) => {
          assert.equal(secret, secrets[i]);
          success();
        })
        .catch(done);
  });
  it("can set shares to " + lib.wallet.length + " users", async function () {
    this.timeout(REGISTRATION_TIME);
    let addresses = [];
    for (let i = 0; i < lib.wallet.length; ++i) {
      addresses[i] = lib.wallet[i].address;
      shares[i] = Math.floor(Math.random() * 10 + 1);
    }
    await lib.setShareholders(addresses, shares);
  });
  it(
    "has set the correct amount of shares to each of the " +
      lib.wallet.length +
      " users",
    async function () {
      this.timeout(REGISTRATION_TIME);
      for (let i = 0; i < lib.wallet.length; ++i) {
        assert.equal(await lib.getShares(lib.wallet[i].address), shares[i]);
      }
    }
  );
});

let remaining;
let votes = { YES: 0, NO: 0, ABSTAIN: 0, STAND_DOWN: 0 };
describe("Assembly Time", function () {
  it("can start the voting", async function () {
    this.timeout(CONTRACT_CREATE_TIME);
    await lib.setVotingTime(voting, 0, VOTING_TIME);
    let votings = await lib.getVotings();
    assert.ok(votings[voting].started);
    assert.ok(votings[voting].running);
  });
  it("can cast all " + lib.wallet.length + " votes", function (done) {
    this.timeout((10 + VOTING_TIME) * 1000);
    let terminated = 0;
    let success = () => {
      if (++terminated === lib.wallet.length) done();
    };
    let error = (err) => done(err);
    for (let i = 0; i < lib.wallet.length; ++i) {
      let id = Math.floor(Math.random() * Object.keys(votes).length);
      let vote = Object.keys(votes)[id];
      votes[vote] += shares[i]; // count expected voting result
      lib.castVote(voting, vote, success, error, i);
    }
  });
  it("can calculate remaining voting time", function (done) {
    lib
      .getVotingInfo(voting)
      .then((info) => {
        remaining =
          new Date(info.endtime * 1000).getTime() - new Date().getTime();
        done();
      })
      .catch(done);
  });
  delay(() => WAIT_FOR_BLOCKS + remaining);
  it("can count the correct number of votes", async function () {
    this.timeout(REGISTRATION_TIME);
    let info = await lib.getVotingInfo(voting);
    console.log({ votes, info });
    assert.ok(info.closed);
    assert.equal(info.results.aye, votes.YES);
    assert.equal(info.results.nay, votes.NO);
    assert.equal(info.results.abstain, votes.ABSTAIN);
    assert.equal(info.results.standDown, votes.STAND_DOWN);
  });
});

describe("Check Ethers Spent", function () {
  it("can calculate cash spent", async function () {
    console.log(
      "    → used %s ether for the tests",
      lib.web3.utils.fromWei(
        balanceBefore.sub(
          lib.web3.utils.toBN(
            await lib.web3.eth.getBalance(lib.wallet[0].address)
          )
        )
      )
    );
  });
});
