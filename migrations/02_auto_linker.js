var LibVoting = artifacts.require("./libraries/LibVoting");
var LibAssembly = artifacts.require("./libraries/LibAssembly");
var LibSign = artifacts.require("./libraries/LibSign");

const link = require("../linker.js");

module.exports = async function (deployer) {
  var LibVotingInstance = await LibVoting.deployed();
  var LibVotingAddress = await LibVotingInstance.address;
  var LibAssemblyInstance = await LibAssembly.deployed();
  var LibAssemblyAddress = await LibAssemblyInstance.address;
  var LibSignInstance = await LibSign.deployed();
  var LibSignAddress = await LibSignInstance.address;

  console.log("Staring the Linking");
  await link(LibVotingAddress, LibAssemblyAddress, LibSignAddress);
  console.log("Linking has finished");
};
