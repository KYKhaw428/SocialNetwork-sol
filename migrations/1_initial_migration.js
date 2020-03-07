/* Migration file to move something from one state to another.
In this case, we are putting our smart contract on the blockchain.
Which means we are updating the blockchain state, from one state to another.
A new file have to be created in numerical order each time a new smart contract 
needs to be deployed on the blockchain. */
const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
