# assembly-contracts

Smart contracts for running assemblies on Voveo

## Installation

`npm i`

## Compile contracts

`npm run build`

## Deploy contract

### Deploy contract to local Ganache

1. Start local ganache

`npm run ganache`

2. Deploy

`npm run migrate-local`

### Deploy contract to Goerli

Check if the private key specified in the file `.secret.goerli` is valid and has enough ETH to pay tx fee

`npm run migrate-goerli`

### Deploy contract to Teams

Check if the private key specified in the file `.secret.teams` is valid and has enough ETH to pay tx fee

`npm run migrate-teams`

## Flatten

The tool `truffle-flattener` is useful to merge all dependent contracts/libs into the source contract for easy reading/browsing code. This also enables to deploy visually on Remix.

The flattened contracts are stored in folder `contracts-flatten`

- Flatten Assembly: `npm run flatten-assembly`
- Flatten Voting: `npm run flatten-voting`
- Flatten Shares: `npm run flatten-shares`
- Flatten all contracts: `npm run flatten-all`

## Generate UML Class Diagram

Please install the tool `sol2uml` (https://www.npmjs.com/package/sol2uml) globally:

`npm link sol2uml --only=production`

To generate diagram, run this cmd:

`sol2uml ./contracts -o ./uml-diagrams/Assembly.svg`

The generated diagram SVG file is stored in folder `uml-diagrams`

## Unit-Test

At first, start local Ganache with this cmd

`npm run ganache`

Then, open another terminal/console to run the test with this cmd

`npm run test`
