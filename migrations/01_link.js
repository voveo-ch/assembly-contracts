var LibSign = artifacts.require("./libraries/LibSign");
var LibVoting = artifacts.require("./libraries/LibVoting");
var LibAssembly = artifacts.require("./libraries/LibAssembly");

const parser = require("../parser.js");

module.exports = async function (deployer,network) {
  await deployer.deploy(LibSign);
  await deployer.link(LibSign, LibVoting);
  await deployer.deploy(LibVoting);
  await deployer.link(LibSign, LibAssembly);
  await deployer.link(LibVoting, LibAssembly);
  await deployer.deploy(LibAssembly);

  let networdId;

  if(network === "development"){
    networdId = "1337";
  }else if(network === "goerli"){
    networdId = "5";
  }

  console.log("Start parsing");
  await parser();
  console.log("End parsing");
};
