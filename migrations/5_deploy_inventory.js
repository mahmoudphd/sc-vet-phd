const Material = artifacts.require("Material");
const MaterialOffers = artifacts.require("MaterialOffers");
const Product = artifacts.require("Product");
const Users = artifacts.require("Users");
const Inventory = artifacts.require("Inventory");

module.exports = function (deployer) {
    return deployer.deploy(
      Inventory,
      Material.address,
      MaterialOffers.address,
      Product.address
    );
};