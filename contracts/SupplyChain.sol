// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Users.sol";
import "./Material.sol";
import "./Product.sol";
import "./Inventory.sol";
import "./Logistics.sol";

/// @author Mahmoud s. El-Gammal
/// @notice This contract spearheaded by PhD. Mahmoud ElDeeb
contract SupplyChain {
    // Reference to the Users contract
    Users private usersContract;

    // Reference to other contracts
    Material private materialContract;
    Product private productContract;
    Inventory private inventoryContract;
    Logistics private logisticsContract;

    // Constructor to initialize contract addresses
    constructor(
        address _usersContractAddress,
        address _materialContractAddress,
        address _productContractAddress,
        address _inventoryContractAddress,
        address _logisticsContractAddress
    ) {
        usersContract = Users(_usersContractAddress);
        materialContract = Material(_materialContractAddress);
        productContract = Product(_productContractAddress);
        inventoryContract = Inventory(_inventoryContractAddress);
        logisticsContract = Logistics(_logisticsContractAddress);
    }

    // ======================
    // Role Verification
    // ======================
    function verifyUserRole(address user, Users.Role requiredRole) public view returns (bool) {
        return usersContract.hasRole(user, requiredRole);
    }

    modifier onlyAdmin() {
        require(verifyUserRole(msg.sender, Users.Role.Admin), "Only Admin can perform this action");
        _;
    }

    modifier onlySupplier() {
        require(verifyUserRole(msg.sender, Users.Role.Supplier), "Only Supplier can perform this action");
        _;
    }

    modifier onlyDistributor() {
        require(verifyUserRole(msg.sender, Users.Role.Distributor), "Only Distributor can perform this action");
        _;
    }

    // ======================
    // Material Functions
    // ======================
    function addMaterial(string memory _name, string memory _description) public onlySupplier {
        materialContract.addMaterial(_name, _description);
    }

    function updateMaterial(uint256 _id, string memory _name, string memory _description) public onlySupplier {
        materialContract.updateMaterial(_id, _name, _description);
    }

    function removeMaterial(uint256 _id) public onlySupplier {
        materialContract.removeMaterial(_id);
    }

    function getMaterial(uint256 _id) public view returns (Material.MaterialDetails memory) {
        return materialContract.getMaterial(_id);
    }

    // ======================
    // Product Functions
    // ======================
    function addProduct(
        string memory _name,
        string memory _description,
        uint256[] memory _materialIds,
        uint256 _expirationDate,
        Product.Conditions memory _conditions
    ) public onlySupplier {
        productContract.addProduct(_name, _description, _materialIds, _expirationDate, _conditions);
    }

    function updateProduct(
        uint256 _id,
        string memory _name,
        string memory _description,
        uint256[] memory _materialIds,
        uint256 _expirationDate,
        Product.Conditions memory _conditions
    ) public onlySupplier {
        productContract.updateProduct(_id, _name, _description, _materialIds, _expirationDate, _conditions);
    }

    function removeProduct(uint256 _id) public onlySupplier {
        productContract.removeProduct(_id);
    }

    function getProduct(uint256 _id) public view returns (Product.ProductDetails memory) {
        return productContract.getProduct(_id);
    }

    // ======================
    // Inventory Functions
    // ======================
    function addMaterialToInventory(uint256 _materialId, uint256 _offerId, uint256 _quantity) public payable onlyDistributor {
        inventoryContract.addMaterialItem(_materialId, _offerId, _quantity);
    }

    function addProductToInventory(uint256 _productId, uint256 _quantity, uint256 _totalCost) public payable onlyDistributor {
        inventoryContract.addProductItem(_productId, _quantity, _totalCost);
    }

    function updateInventoryItemQuantity(uint256 _id, uint256 _quantity) public onlyDistributor {
        inventoryContract.updateItemQuantity(_id, _quantity);
    }

    function removeInventoryItem(uint256 _id) public onlyDistributor {
        inventoryContract.removeItem(_id);
    }

    function getInventoryItem(uint256 _id) public view returns (Inventory.InventoryItem memory) {
        return inventoryContract.getItem(_id);
    }

    // ======================
    // Logistics Functions
    // ======================
    function initiateTransfer(
        Logistics.ItemType _itemType,
        uint256 _itemId,
        uint256 _quantity,
        address _destination
    ) public onlyDistributor {
        logisticsContract.initiateTransfer(_itemType, _itemId, _quantity, _destination);
    }

    function approveTransfer(uint256 _id) public {
        logisticsContract.approveTransfer(_id);
    }

    function completeTransfer(uint256 _id) public {
        logisticsContract.completeTransfer(_id);
    }

    function getTransfer(uint256 _id) public view returns (Logistics.Transfer memory) {
        return logisticsContract.getTransfer(_id);
    }
}