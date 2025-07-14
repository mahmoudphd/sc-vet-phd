// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Material.sol";

contract Product {
    struct ProductDetails {
        uint256 id;
        string name;
        string description;
        uint256[] materialIds; // IDs of materials required
        uint256 expirationDate; // Unix timestamp
        Conditions conditions;
    }

    struct Conditions {
        int256 temperatureCondition; // In Celsius
        uint256 humidityCondition;   // In percentage
    }

    // Mapping to store products
    mapping(uint256 => ProductDetails) public products;
    uint256 public productCount;

    // Events
    event ProductAdded(uint256 indexed id, string name, string description, uint256[] materialIds, uint256 expirationDate, Conditions conditions);
    event ProductUpdated(uint256 indexed id, string name, string description, uint256[] materialIds, uint256 expirationDate, Conditions conditions);
    event ProductRemoved(uint256 indexed id);

    // Add a new product
    function addProduct(
        string memory _name,
        string memory _description,
        uint256[] memory _materialIds,
        uint256 _expirationDate,
        Conditions memory _conditions
    ) public {
        productCount++;
        products[productCount] = ProductDetails(productCount, _name, _description, _materialIds, _expirationDate, _conditions);
        emit ProductAdded(productCount, _name, _description, _materialIds, _expirationDate, _conditions);
    }

    // Update a product
    function updateProduct(
        uint256 _id,
        string memory _name,
        string memory _description,
        uint256[] memory _materialIds,
        uint256 _expirationDate,
        Conditions memory _conditions
    ) public {
        require(products[_id].id != 0, "Product does not exist");
        products[_id] = ProductDetails(_id, _name, _description, _materialIds, _expirationDate, _conditions);
        emit ProductUpdated(_id, _name, _description, _materialIds, _expirationDate, _conditions);
    }

    // Remove a product
    function removeProduct(uint256 _id) public {
        require(products[_id].id != 0, "Product does not exist");
        delete products[_id];
        emit ProductRemoved(_id);
    }

    // Get details of a product
    function getProduct(uint256 _id) public view returns (ProductDetails memory) {
        require(products[_id].id != 0, "Product does not exist");
        return products[_id];
    }
}