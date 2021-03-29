const libsign = artifacts.require("libsign");
const LibVoting = artifacts.require("LibVoting");
const LibAssembly = artifacts.require("LibAssembly");

const Assembly = artifacts.require("Assembly");

contract("Assembly", (acc) => {
  let libsignContract;
  let libVotingContract;
  let libAssemblyContract;

  let assemblyContract;

  const identifier = "ID_123";
  const address = "0x32Ddbb3164E988C6661B09aAdc75992ce3f36fFD";

  beforeEach("setup instances", async () => {
    libsignContract = await libsign.new();

    await LibVoting.link("libsign", libsignContract.address);
    libVotingContract = await LibVoting.new();

    await LibAssembly.link("libsign", libsignContract.address);
    await LibAssembly.link("LibVoting", libVotingContract.address);
    libAssemblyContract = await LibAssembly.new();

    await Assembly.link("LibAssembly", libAssemblyContract.address);
    assemblyContract = await Assembly.new(identifier, address);
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
});
