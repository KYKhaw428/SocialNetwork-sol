require('babel-register');
require('babel-polyfill');

module.exports = {
  // Tells which block chain we want to connect to.
  networks: {
    // Tell truffle project to connect to ganache instance which is running on local host.
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    // Tell truffle project to connect to rinkeby testnet.
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: 4,
      gas: 4700000
    }
  },
  /* Customized to place smart contracts and abis inside 
  directory that can be exposed to the client side application. */
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
