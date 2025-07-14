const Inventory = artifacts.require("Inventory");
const Logistics = artifacts.require("Logistics");

module.exports = function (deployer) {
    return deployer.deploy(Logistics, Inventory.address);
};