var Migrations = artifacts.require("./DIY.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
