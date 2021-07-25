var LibSign = artifacts.require("./libraries/LibSign");
var LibVoting = artifacts.require("./libraries/LibVoting");
var LibAssembly = artifacts.require("./libraries/LibAssembly");

module.exports = async function (deployer) {
  await deployer.deploy(LibSign);
  await deployer.link(LibSign, LibVoting);
  await deployer.deploy(LibVoting);
  await deployer.link(LibSign, LibAssembly);
  await deployer.link(LibVoting, LibAssembly);
  await deployer.deploy(LibAssembly);
};
