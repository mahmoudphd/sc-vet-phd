// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Users.sol";

contract MaterialOffers {
    Users private usersContract;

    struct Offer {
        uint256 id;
        uint256 materialId; // Link to the Material contract
        address supplier;   // Address of the supplier
        uint256 price;      // Price per unit
    }

    // Mapping to store offers by material ID
    mapping(uint256 => Offer[]) public materialOffers;

    // Mapping to store offers by supplier
    mapping(address => Offer[]) public supplierOffers;

    uint256 public offerCount;

    // Events
    event OfferAdded(uint256 indexed id, uint256 materialId, address indexed supplier, uint256 price);
    event OfferUpdated(uint256 indexed id, uint256 price);
    event OfferRemoved(uint256 indexed id);

    // Constructor to initialize the Users contract address
    constructor(address _usersContractAddress) {
        usersContract = Users(_usersContractAddress);
    }

    // Modifier to restrict access to suppliers
    modifier onlySupplier() {
        require(usersContract.hasRole(msg.sender, Users.Role.Supplier), "Only Supplier can perform this action");
        _;
    }

    // Add a new offer (only suppliers can do this)
    function addOffer(uint256 _materialId, uint256 _price) public onlySupplier {
        offerCount++;
        Offer memory newOffer = Offer(offerCount, _materialId, msg.sender, _price);

        // Add the offer to materialOffers and supplierOffers
        materialOffers[_materialId].push(newOffer);
        supplierOffers[msg.sender].push(newOffer);

        emit OfferAdded(offerCount, _materialId, msg.sender, _price);
    }

    // Update an offer's price (only the supplier who added it can do this)
    function updateOfferPrice(uint256 _id, uint256 _price) public {
        bool offerFound = false;

        // Search for the offer in the supplier's offers
        for (uint256 i = 0; i < supplierOffers[msg.sender].length; i++) {
            if (supplierOffers[msg.sender][i].id == _id) {
                supplierOffers[msg.sender][i].price = _price;
                offerFound = true;
                break;
            }
        }

        require(offerFound, "Offer not found or you are not the supplier");

        // Update the price in materialOffers
        for (uint256 i = 0; i < materialOffers[supplierOffers[msg.sender][0].materialId].length; i++) {
            if (materialOffers[supplierOffers[msg.sender][0].materialId][i].id == _id) {
                materialOffers[supplierOffers[msg.sender][0].materialId][i].price = _price;
                break;
            }
        }

        emit OfferUpdated(_id, _price);
    }

    // Remove an offer (only the supplier who added it can do this)
    function removeOffer(uint256 _id) public {
        bool offerFound = false;

        // Remove the offer from supplierOffers
        for (uint256 i = 0; i < supplierOffers[msg.sender].length; i++) {
            if (supplierOffers[msg.sender][i].id == _id) {
                supplierOffers[msg.sender][i] = supplierOffers[msg.sender][supplierOffers[msg.sender].length - 1];
                supplierOffers[msg.sender].pop();
                offerFound = true;
                break;
            }
        }

        require(offerFound, "Offer not found or you are not the supplier");

        // Remove the offer from materialOffers
        for (uint256 i = 0; i < materialOffers[supplierOffers[msg.sender][0].materialId].length; i++) {
            if (materialOffers[supplierOffers[msg.sender][0].materialId][i].id == _id) {
                materialOffers[supplierOffers[msg.sender][0].materialId][i] = materialOffers[supplierOffers[msg.sender][0].materialId][materialOffers[supplierOffers[msg.sender][0].materialId].length - 1];
                materialOffers[supplierOffers[msg.sender][0].materialId].pop();
                break;
            }
        }

        emit OfferRemoved(_id);
    }

    // Get all offers for a specific material
    function getOffersByMaterial(uint256 _materialId) public view returns (Offer[] memory) {
        return materialOffers[_materialId];
    }

    // Get all offers by a specific supplier
    function getOffersBySupplier(address _supplier) public view returns (Offer[] memory) {
        return supplierOffers[_supplier];
    }
}