// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Users {
    enum Role { None, Admin, Supplier, Distributor }
    struct User {
        string email;
        string name;
        Role role;
    }

    // Mapping to store user roles
    mapping(address => User) public users;

    // Events
    event UserAdded(address indexed user, string email, string name, Role role);
    event UserRemoved(address indexed user);
    event RoleUpdated(address indexed user, Role newRole);

    // Constructor to set the deployer as the initial admin
    constructor() {
        users[msg.sender] = User("admin@example.com", "Admin", Role.Admin);
        emit UserAdded(msg.sender, "admin@example.com", "Admin", Role.Admin);
    }

    // Check if a user has a specific role
    function hasRole(address user, Role role) public view returns (bool) {
        return users[user].role == role;
    }

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(hasRole(msg.sender, Role.Admin), "Only Admin can perform this action");
        _;
    }

    // // Add a new user with email, name, and role (only Admin can do this)
    function addUser(
        address user,
        string memory email,
        string memory name,
        Role role
    ) public onlyAdmin {
        require(users[user].role == Role.None, "User already exists");
        users[user] = User(email, name, role);
        emit UserAdded(user, email, name, role);
    }

    // // Update a user's role (only Admin can do this)
    function updateUserRole(address user, Role newRole) public onlyAdmin {
        require(users[user].role != Role.None, "User does not exist");
        users[user].role = newRole;
        emit RoleUpdated(user, newRole);
    }
}