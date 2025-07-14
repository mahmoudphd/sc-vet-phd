const Users = artifacts.require("Users");
const SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", (accounts) => {
  let usersContract;
  let supplyChainContract;

  const admin = accounts[0];
  const supplier = accounts[1];
  const distributor = accounts[2];
  const unauthorizedUser = accounts[3];

  before(async () => {
    // Deploy the Users contract
    usersContract = await Users.new();
    // Deploy the SupplyChain contract with the Users contract address
    supplyChainContract = await SupplyChain.new(usersContract.address);

    // Assign roles
    await usersContract.addUser(admin, "admins@example.com", "Admin", Users.Role.Admin, { from: admin });
    await usersContract.addUser(supplier, "suppliers@example.com", "Supplier", Users.Role.Supplier, { from: admin });
    await usersContract.addUser(distributor, "distributors@example.com", "Distributor", Users.Role.Distributor, { from: admin });
  });

  it("should verify admin role", async () => {
    const isAdmin = await supplyChainContract.verifyUserRole(admin, Users.Role.Admin);
    assert.equal(isAdmin, true, "Admin role verification failed");
  });

  it("should verify supplier role", async () => {
    const isSupplier = await supplyChainContract.verifyUserRole(supplier, Users.Role.Supplier);
    assert.equal(isSupplier, true, "Supplier role verification failed");
  });

  it("should verify distributor role", async () => {
    const isDistributor = await supplyChainContract.verifyUserRole(distributor, Users.Role.Distributor);
    assert.equal(isDistributor, true, "Distributor role verification failed");
  });

  it("should return false for unauthorized user", async () => {
    const isUnauthorized = await supplyChainContract.verifyUserRole(unauthorizedUser, Users.Role.Admin);
    assert.equal(isUnauthorized, false, "Unauthorized user should not have any role");
  });

  it("should allow admin to call admin-only function", async () => {
    try {
      await supplyChainContract.adminOnlyFunction({ from: admin });
      assert.ok(true, "Admin should be able to call admin-only function");
    } catch (error) {
      assert.fail("Admin should be able to call admin-only function");
    }
  });

  it("should prevent non-admin from calling admin-only function", async () => {
    try {
      await supplyChainContract.adminOnlyFunction({ from: supplier });
      assert.fail("Non-admin should not be able to call admin-only function");
    } catch (error) {
      assert.include(error.message, "Only Admin can call this function", "Error message mismatch");
    }
  });

  it("should prevent unauthorized user from calling admin-only function", async () => {
    try {
      await supplyChainContract.adminOnlyFunction({ from: unauthorizedUser });
      assert.fail("Unauthorized user should not be able to call admin-only function");
    } catch (error) {
      assert.include(error.message, "Only Admin can call this function", "Error message mismatch");
    }
  });
});