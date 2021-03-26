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
