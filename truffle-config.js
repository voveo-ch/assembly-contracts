module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  //networks: {
  //  development: {
  //    host: "127.0.0.1",
  //    port: 7545,
  //    network_id: "*"
  //  },
  //  test: {
  //    host: "127.0.0.1",
  //    port: 7545,
  //    network_id: "*"
  //  }
  //}

  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          //runs: 5
        },
        libraries: {
          "contracts/Assembly.sol": {
            LibAssembly: "0x8790A9166E24ea0212F69843Af1cc139c8Cf7849", // goerli: "0x137db383A731C278555C458955EEa9431d07769a",
            libsign: "0x34349d057D2a42056f11eaAF8Cb6890F0B71e512", // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
          },
          "contracts/LibAssembly.sol": {
            libsign: "0x34349d057D2a42056f11eaAF8Cb6890F0B71e512", // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
          },
          "contracts/signed.sol": {
            libsign: "0x34349d057D2a42056f11eaAF8Cb6890F0B71e512", // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
          },
          "contracts/LibVoting.sol": {
            libsign: "0x34349d057D2a42056f11eaAF8Cb6890F0B71e512", // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
          },
          "contracts/Voting.sol": {
            LibVoting: "0xB32e98b87e03eCd81C47180A0051d9eb6609F060", // goerli: "0x1Fba0a861879b63bFEf0c59088945b8053f20267",
            libsign: "0x34349d057D2a42056f11eaAF8Cb6890F0B71e512", // goerli: "0xc422a2cE13f5Bc04Ca2F36af4Fe12a63232E6e31",
          },
        },
      },
    },
  },
};
