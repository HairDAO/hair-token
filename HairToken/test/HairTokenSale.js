const { expect } = require("chai");
const hre = require("hardhat");

describe("HairAuction", () => {
  let hairAuction;
  let hairToken;
  let owner;
  let addr1;
  let addre2;
  let tokenPrice = 320000; //in gwei
  let initSupply = 125000;

  before(async () => {
    // Get the contract factory for the HairAuction contract
    const HairAuction = await getContractFactory("HairAuction");
    [owner, addr1, addr2] = await hardhat.ethers.getSigners();

    // Deploy the contract and get a reference to it
    hairAuction = await HairAuction.deploy([]);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hairAuction.owner()).to.equal(owner.address);
    });
  });
});
