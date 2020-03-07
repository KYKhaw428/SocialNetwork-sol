/* Uses same name as solidity smart contract file. 
Truffle uses artifacts which comes from the abi directory files to perform the migration.
Files are numbered so truffle knows which order to run the migration. */
const SocialNetwork = artifacts.require("SocialNetwork");

module.exports = function(deployer) {
  deployer.deploy(SocialNetwork);
};
