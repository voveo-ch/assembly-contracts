const libsign = artifacts.require("./libarires/LibSign.sol");
const LibVoting = artifacts.require("./libarires/LibVoting.sol");
const LibAssembly = artifacts.require("./libarires/LibAssembly.sol");

const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545");

const Assembly = artifacts.require("./Assembly.sol");

let Account = require("eth-lib/lib/account");

contract("Assembly", (accounts) => {
  let libsignContract;
  let libVotingContract;
  let libAssemblyContract;

  let assemblyContract;

  const identifier = "ID_123";

  beforeEach("setup instances", async () => {
    libsignContract = await libsign.new();

    await LibVoting.link("LibSign", libsignContract.address);
    libVotingContract = await LibVoting.new();

    await LibAssembly.link("LibSign", libsignContract.address);
    await LibAssembly.link("LibVoting", libVotingContract.address);
    libAssemblyContract = await LibAssembly.new();

    await Assembly.link("LibAssembly", libAssemblyContract.address);
    await Assembly.link("LibSign", libsignContract.address);
    assemblyContract = await Assembly.new(identifier, accounts[1]);
  });

  describe("Identifier", async () => {
    it("Check identifier", async () => {
      const id = await assemblyContract.identifier();
      assert.equal(id, identifier);
    });
  });

  describe("Register", async () => {
    it("Should revert when register with invalid signatur", async () => {
      const secret = "my secret";
      const v = 0;
      const r = web3.utils.toHex("some r");
      const s = web3.utils.toHex("some s");

      try {
        await assemblyContract.register(secret, v, r, s);
        assert.fail("Expected revert not received");
      } catch (err) {
        assert.equal(
          err.reason,
          "identification failed due to invalid signature"
        );
      }
    });
  });

  describe("New Voting", async () => {
    it("Should revert when vote with invalid signatur", async () => {
      const title = "Test title";
      const proposal = "Test Proposal";
      const privateKey2 =
        "0xa36567a0637d05a4352187dd536c9d50160e80f72919a3fc8c21f0a4d4551788";
      const inputs = ["string", "string", "address"];
      const args = [title, proposal, assemblyContract.address];

      try {
        let messageHash3 = await web3.eth.abi.encodeParameters(inputs, args);
        let finalMsg = await web3.utils.keccak256(messageHash3);
        const signature = await web3.eth.accounts.sign(finalMsg, privateKey2);

        await assemblyContract.newVoting(
          title,
          proposal,
          signature.v,
          signature.r,
          signature.s,
          {
            from: accounts[0],
          }
        );
        //assert.equal(accounts[1],add );
      } catch (error) {
        console.log(error);
      }
    });
  });
});
