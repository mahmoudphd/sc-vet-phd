const Users = artifacts.require("Users");
const MaterialOffers = artifacts.require("MaterialOffers");

module.exports = function (deployer) {
  return deployer.deploy(MaterialOffers, Users.address);
};