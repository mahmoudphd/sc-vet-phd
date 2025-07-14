const Users = artifacts.require("Users");
const Material = artifacts.require("Material");

module.exports = function (deployer) {
  return deployer.deploy(Material, Users.address);
};