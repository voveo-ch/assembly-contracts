console.log("Into the linker");

var AssemblyArtifact = require("./artifacts/Assembly.json");
var VotingArtifact = require("./artifacts/Voting.json");
var SignedArtifact = require("./artifacts/Signed.json");

var linker = require("solc/linker");
const path = require("path");
const fs = require("fs");


module.exports = async (
  LibVotingAddress,
  LibAssemblyAddress,
  LibSignAddress,
  network
) => {
  console.log("Starting the linking process");
  const AssemblyFilePath = `/artifacts/${network}/Assembly.json`;
  const VotingFilePath = `/artifacts/${network}/Voting.json`;
  const SignedFilePath = `/artifacts/${network}/Signed.json`;

  var votingLinkedBytecode = linker.linkBytecode(VotingArtifact.bytecode, {
    LibVoting: LibVotingAddress,
  });
  VotingArtifact.bytecode = votingLinkedBytecode;
  fs.writeFile(
    path.join(__dirname, VotingFilePath),
    JSON.stringify(VotingArtifact),
    function (err) {
      if (err) return console.log(err);
      console.log("Writing updated Voting bytecode to " + VotingFilePath);
    }
  );
  var assemblyLinkedBytecode = linker.linkBytecode(AssemblyArtifact.bytecode, {
    LibAssembly: LibAssemblyAddress
  });
  AssemblyArtifact.bytecode = assemblyLinkedBytecode;
  fs.writeFile(
    path.join(__dirname, AssemblyFilePath),
    JSON.stringify(AssemblyArtifact),
    function (err) {
      if (err) return console.log(err);
      console.log("Writing updated Assembly bytecode to " + AssemblyFilePath);
    }
  );

  var signedLinkedBytecode = linker.linkBytecode(SignedArtifact.bytecode, {
    LibSign: LibSignAddress,
  });
  SignedArtifact.bytecode = signedLinkedBytecode;
  fs.writeFile(
    path.join(__dirname, SignedFilePath),
    JSON.stringify(SignedArtifact),
    function (err) {
      if (err) return console.log(err);
      console.log("Writing updated Signed bytecode to " + SignedFilePath);
    }
  );
  console.log("Linking process is finished");
};
