// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Material.sol";
import "./MaterialOffers.sol";
import "./Product.sol";

contract Inventory {
    Material private materialContract;
    MaterialOffers private materialOffersContract;
    Product private productContract;

    enum ItemType { Material, Product }

    struct InventoryItem {
        uint256 id;
        ItemType itemType;  // Material or Product
        uint256 itemId;     // ID of the material or product
        uint256 offerId;    // Link to the MaterialOffers contract (only for materials)
        uint256 quantity;   // Quantity purchased
        uint256 totalCost;  // Total cost of the purchase
        address buyer;      // Address of the buyer
    }

    // Mapping to store inventory items
    mapping(uint256 => InventoryItem) public inventory;
    uint256 public inventoryCount;

    // Events
    event ItemAdded(uint256 indexed id, ItemType itemType, uint256 itemId, uint256 offerId, uint256 quantity, uint256 totalCost, address indexed buyer);
    event ItemUpdated(uint256 indexed id, uint256 quantity);
    event ItemRemoved(uint256 indexed id);

    // Constructor to initialize the Material, MaterialOffers, and Product contract addresses
    constructor(
        address _materialContractAddress,
        address _materialOffersContractAddress,
        address _productContractAddress
    ) {
        materialContract = Material(_materialContractAddress);
        materialOffersContract = MaterialOffers(_materialOffersContractAddress);
        productContract = Product(_productContractAddress);
    }

    // Add a new material item to the inventory
    function addMaterialItem(uint256 _materialId, uint256 _offerId, uint256 _quantity) public payable {
        // Fetch the offer details
        MaterialOffers.Offer memory offer = materialOffersContract.getOffersByMaterial(_materialId)[_offerId];

        // Calculate the total cost
        uint256 totalCost = offer.price * _quantity;

        // Ensure the buyer sent enough Ether
        require(msg.value >= totalCost, "Insufficient Ether sent");

        // Transfer Ether to the supplier
        payable(offer.supplier).transfer(totalCost);

        // Add the item to the inventory
        _addItem(ItemType.Material, _materialId, _offerId, _quantity, totalCost);
    }

    // Add a new product item to the inventory
    function addProductItem(uint256 _productId, uint256 _quantity, uint256 _totalCost) public payable {
        // Ensure the buyer sent enough Ether
        require(msg.value >= _totalCost, "Insufficient Ether sent");

        // Add the item to the inventory
        _addItem(ItemType.Product, _productId, 0, _quantity, _totalCost);
    }

    // Internal function to add an item to the inventory (DRY)
    function _addItem(ItemType _itemType, uint256 _itemId, uint256 _offerId, uint256 _quantity, uint256 _totalCost) internal {
        inventoryCount++;
        inventory[inventoryCount] = InventoryItem(
            inventoryCount,
            _itemType,
            _itemId,
            _offerId,
            _quantity,
            _totalCost,
            msg.sender
        );

        emit ItemAdded(inventoryCount, _itemType, _itemId, _offerId, _quantity, _totalCost, msg.sender);
    }

    // Update the quantity of an item in the inventory
    function updateItemQuantity(uint256 _id, uint256 _quantity) public {
        require(inventory[_id].id != 0, "Item does not exist");
        require(inventory[_id].buyer == msg.sender, "Only the buyer can update this item");

        inventory[_id].quantity = _quantity;
        emit ItemUpdated(_id, _quantity);
    }

    // Remove an item from the inventory
    function removeItem(uint256 _id) public {
        require(inventory[_id].id != 0, "Item does not exist");
        require(inventory[_id].buyer == msg.sender, "Only the buyer can remove this item");

        delete inventory[_id];
        emit ItemRemoved(_id);
    }

    // Get details of an item in the inventory
    function getItem(uint256 _id) public view returns (InventoryItem memory) {
        require(inventory[_id].id != 0, "Item does not exist");
        return inventory[_id];
    }
}