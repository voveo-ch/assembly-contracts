/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */
require("babel-register");
require("@babel/polyfill");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "" // add your metamask mnemonics

const fs = require("fs");
const path = require("path");

module.exports = {
  plugins: ["truffle-security"],

  contracts_directory: "contracts",

  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    xdai: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: "https://dai.poa.network"
        }),
      gas: 500000,
      gasPrice: 1000000000,
      network_id: 100
    },

    rinkeby: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: "https://rinkeby.infura.io/v3/", // add infura api key
          numberOfAddresses: 1,
          shareNonce: true
        }),
      gasPrice: 25000000000,
      network_id: 4
    },

    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    goerli: {
      provider: () => {
        const privatekey = fs
          .readFileSync(`${path.dirname(__filename)}/.secret.goerli`)
          .toString();
        return new HDWalletProvider(
          privatekey,
          `https://goerli.infura.io/v3/62db62ec8ca146d29038a146ee09ae0e`
        );
      },
      network_id: 5,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }

  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.6",
      parser: "solcjs",
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      /*
       outputSelection: {
         "*": {
           "*": ["metadata", "abi", "evm.bytecode", "evm.bytecode.linkReferences", "evm.gasEstimates"]
         }
       },
       */
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        //  libraries: {
        //    "contracts/Assembly.sol": {
        //      LibAssembly: "0x25E771988BCf8F773d2846C08EAE99865D3f1aed",
        //      // simons local ganache: "0xaD888d0Ade988EbEe74B8D4F39BF29a8d0fe8A8D",
        //      // teams: "0x25E771988BCf8F773d2846C08EAE99865D3f1aed",
        //      // goerli: "0x137db383A731C278555C458955EEa9431d07769a",
        //      libsign: "0x8E9AFDC0AE930873Acad7DC2C704d3771E68f692",
        //      // simons local ganache:"0xD86C8F0327494034F60e25074420BcCF560D5610",
        //      // teams: "0x8E9AFDC0AE930873Acad7DC2C704d3771E68f692",
        //      // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
        //    },
        //    "contracts/LibAssembly.sol": {
        //      libsign: "0x8E9AFDC0AE930873Acad7DC2C704d3771E68f692",
        //      // simons local ganache:"0xD86C8F0327494034F60e25074420BcCF560D5610", -------Done
        //      // teams: "0x8E9AFDC0AE930873Acad7DC2C704d3771E68f692",
        //      // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
        //    },
        //    "contracts/signed.sol": {
        //      libsign: "0x8E9AFDC0AE930873Acad7DC2C704d3771E68f692",
        //      // simons local ganache:"0xD86C8F0327494034F60e25074420BcCF560D5610",
        //      // teams: "0x8E9AFDC0AE930873Acad7DC2C704d3771E68f692",
        //      // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
        //    },
        //    "contracts/Voting.sol": {
        //      LibVoting: "0x1351C98F794c7D1EACFb5276dA70A1cACB9e88B4",
        //      // simons local ganache:"0x4bf749ec68270027C5910220CEAB30Cc284c7BA2",
        //      // teams: "0x1351C98F794c7D1EACFb5276dA70A1cACB9e88B4",
        //      // goerli: "0x1Fba0a861879b63bFEf0c59088945b8053f20267",
        //      libsign: "0x8E9AFDC0AE930873Acad7DC2C704d3771E68f692",
        //      // simons local ganache:"0xD86C8F0327494034F60e25074420BcCF560D5610",
        //      // teams: "0x8E9AFDC0AE930873Acad7DC2C704d3771E68f692",
        //      // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
        //    },
        //  },
      },
    },
  },
};
