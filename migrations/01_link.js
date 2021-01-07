var libsign = artifacts.require("libsign");
var LibVoting = artifacts.require("LibVoting");
var LibAssembly = artifacts.require("LibAssembly");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(libsign);
  await deployer.link(libsign, LibVoting);
  await deployer.deploy(LibVoting);
  await deployer.link(libsign, LibAssembly);
  await deployer.link(LibVoting, LibAssembly);
  await deployer.deploy(LibAssembly);
};
