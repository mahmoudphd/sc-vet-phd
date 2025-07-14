// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Users.sol";

contract Material {
    Users private usersContract;

    struct MaterialDetails {
        uint256 id;
        string name;
        string description;
    }

    // Mapping to store materials
    mapping(uint256 => MaterialDetails) public materials;
    uint256 public materialCount;

    // Events
    event MaterialAdded(uint256 indexed id, string name, string description);
    event MaterialUpdated(uint256 indexed id, string name, string description);
    event MaterialRemoved(uint256 indexed id);

    // Constructor to initialize the Users contract address
    constructor(address _usersContractAddress) {
        usersContract = Users(_usersContractAddress);
    }

    // Modifier to restrict access to admins
    modifier onlyAdmin() {
        require(usersContract.hasRole(msg.sender, Users.Role.Admin), "Only Admin can perform this action");
        _;
    }

    // Add a new material (only admins can do this)
    function addMaterial(string memory _name, string memory _description) public onlyAdmin {
        materialCount++;
        materials[materialCount] = MaterialDetails(materialCount, _name, _description);
        emit MaterialAdded(materialCount, _name, _description);
    }

    // Update a material (only admins can do this)
    function updateMaterial(uint256 _id, string memory _name, string memory _description) public onlyAdmin {
        require(materials[_id].id != 0, "Material does not exist");
        materials[_id].name = _name;
        materials[_id].description = _description;
        emit MaterialUpdated(_id, _name, _description);
    }

    // Remove a material (only admins can do this)
    function removeMaterial(uint256 _id) public onlyAdmin {
        require(materials[_id].id != 0, "Material does not exist");
        delete materials[_id];
        emit MaterialRemoved(_id);
    }

    // Get details of a material
    function getMaterial(uint256 _id) public view returns (MaterialDetails memory) {
        require(materials[_id].id != 0, "Material does not exist");
        return materials[_id];
    }
}