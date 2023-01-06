const { expect } = require("chai");
const hre = require("hardhat");

describe("HairTokenSale", () => {
  let hairTokenSale;
  let hairToken;
  let owner;
  let addr1;
  let addr2;
  let tokenPrice = 320000000000000; //in wei
  let initSupply = 125000;

  before(async () => {
    // Get the contract factory for the HairToken contract
    const HairToken = await hre.ethers.getContractFactory("HairToken");
    hairToken = await HairToken.deploy(initSupply);

    // Get the contract factory for the HairAuction contract
    const HairTokenSale = await ethers.getContractFactory("HairTokenSale");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    // Deploy the contract and get a reference to it
    hairTokenSale = await HairTokenSale.deploy([]);
  });

  describe("Deployment", function () {
    it("initializes the contract with the correct values", function () {
      return hairTokenSale
        .deployed()
        .then(function (instance) {
          hairTokenSale = instance;
          return hairTokenSale.address;
        })
        .then(function (address) {
          expect(address).to.not.equal(0x0, "has contract address");
          return hairTokenSale.tokenContract();
        })
        .then(function (address) {
          expect(address).to.not.equal(0x0, "has token contract address");
          return hairTokenSale.tokenPrice();
        })
        .then(function (price) {
          expect(price).to.equal(tokenPrice, "token price is correct");
        });
    });
  });
});
