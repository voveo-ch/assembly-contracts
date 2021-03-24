# Smart contracts for Voveo assemblies

These are the solidity contracts for assemblies and voting of [Voveo](https://voveo.ch).

## Get started

1. clone repo
1. run `truffle compile --all` or ` npx truffle compile --all --config truffle-config.js` (dry run)
1. run `truffle migrate --network NETWORK` or ` npx migrate --network NETWORK --config truffle-config.js`
1. NETWORK is the code for the blockchain as configure in truffle-config, e.g. goerli or main
1. with this command, the library contracts are deployed on the blockchain.
1. run `truffle compile --all` again in order to get the correct bytecode (now linked to the library contract)
