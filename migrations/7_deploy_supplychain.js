const Users = artifacts.require("Users");
const Material = artifacts.require("Material");
const Product = artifacts.require("Product");
const Inventory = artifacts.require("Inventory");
const Logistics = artifacts.require("Logistics");
const SupplyChain = artifacts.require("SupplyChain");

module.exports = function (deployer) {
    return deployer.deploy(
      SupplyChain,
      Users.address,
      Material.address,
      Product.address,
      Inventory.address,
      Logistics.address
    );
};