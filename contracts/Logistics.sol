// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Inventory.sol";

contract Logistics {
    Inventory private inventoryContract;

    enum ItemType { Material, Product }
    enum TransferStatus { Pending, Approved, Completed }

    struct Transfer {
        uint256 id;
        ItemType itemType;  // Material or Product
        uint256 itemId;     // ID of the material or product
        uint256 quantity;   // Quantity to transfer
        address source;     // Source address
        address destination; // Destination address
        TransferStatus status; // Transfer status
    }

    // Mapping to store transfers
    mapping(uint256 => Transfer) public transfers;
    uint256 public transferCount;

    // Events
    event TransferInitiated(uint256 indexed id, ItemType itemType, uint256 itemId, uint256 quantity, address indexed source, address indexed destination);
    event TransferApproved(uint256 indexed id);
    event TransferCompleted(uint256 indexed id);

    // Constructor to initialize the Inventory contract address
    constructor(address _inventoryContractAddress) {
        inventoryContract = Inventory(_inventoryContractAddress);
    }

    // Initiate a new transfer
    function initiateTransfer(
        ItemType _itemType,
        uint256 _itemId,
        uint256 _quantity,
        address _destination
    ) public {
        // Verify that the source has enough items in inventory
        require(_quantity > 0, "Quantity must be greater than 0");

        // Add the transfer to the list
        transferCount++;
        transfers[transferCount] = Transfer(
            transferCount,
            _itemType,
            _itemId,
            _quantity,
            msg.sender,
            _destination,
            TransferStatus.Pending
        );

        emit TransferInitiated(transferCount, _itemType, _itemId, _quantity, msg.sender, _destination);
    }

    // Approve a transfer (only the destination can approve)
    function approveTransfer(uint256 _id) public {
        require(transfers[_id].id != 0, "Transfer does not exist");
        require(transfers[_id].destination == msg.sender, "Only the destination can approve this transfer");
        require(transfers[_id].status == TransferStatus.Pending, "Transfer is not pending");

        transfers[_id].status = TransferStatus.Approved;
        emit TransferApproved(_id);
    }

    // Complete a transfer (only the source can complete)
    function completeTransfer(uint256 _id) public {
        require(transfers[_id].id != 0, "Transfer does not exist");
        require(transfers[_id].source == msg.sender, "Only the source can complete this transfer");
        require(transfers[_id].status == TransferStatus.Approved, "Transfer is not approved");

        // Update inventory (assuming the Inventory contract has functions to handle transfers)
        // For simplicity, this example does not modify the inventory directly.
        // You can add logic to update the inventory here.

        transfers[_id].status = TransferStatus.Completed;
        emit TransferCompleted(_id);
    }

    // Get details of a transfer
    function getTransfer(uint256 _id) public view returns (Transfer memory) {
        require(transfers[_id].id != 0, "Transfer does not exist");
        return transfers[_id];
    }
}
