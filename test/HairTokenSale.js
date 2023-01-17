const { expect } = require("chai");
const hre = require("hardhat");

describe("HairTokenSale", () => {
  let hairTokenSale;
  let hairToken;
  let tokenPrice = hre.ethers.utils.parseEther("0.0007");
  let initSupply = hre.ethers.utils.parseEther("125000");

  before(async () => {
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    // Get the contract factory for the HairToken contract
    const HairToken = await hre.ethers.getContractFactory("HairToken");
    hairToken = await HairToken.deploy(initSupply, owner.address);

    //Get the contract factory for the HairAuction contract
    const HairTokenSale = await ethers.getContractFactory("HairTokenSale");

    // Deploy the contract and get a reference to it
    hairTokenSale = await HairTokenSale.deploy(hairToken.address, tokenPrice);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hairToken.owner()).to.equal(owner.address);
    });

    it("Should set the token contract", async function () {
      expect(await hairTokenSale.tokenContract()).to.equal(hairToken.address);
    });

    it("Should set token price", async function () {
      expect(await hairTokenSale.tokenPrice()).to.equal(tokenPrice);
    });
  });

  describe("Sale", function () {
    it("Cannot buy tokens if sale hasn't started", async function () {
      await expect(
        hairTokenSale.connect(addr1).buyTokens(1, { value: tokenPrice })
      ).to.be.revertedWith("Sale is not running");
    });

    it("Cannot buy more tokens than available in the contract", async function () {
      await hairTokenSale.connect(owner).startSale();

      await expect(
        hairTokenSale
          .connect(addr1)
          .buyTokens(hre.ethers.utils.parseEther("1"), {
            value: tokenPrice,
          })
      ).to.be.revertedWith("Not enough tokens left for sale");
    });

    it("Cannot buy tokens when sending wrong ETH amount", async function () {
      await hairTokenSale.connect(owner).startSale();

      // Transfer 100 tokens to the sale contract
      await hairToken
        .connect(owner)
        .transfer(hairTokenSale.address, hre.ethers.utils.parseEther("100"));

      // Try to buy 1 token with 0.000001 ETH instead of the correct amount 0.0007 ETH
      await expect(
        hairTokenSale
          .connect(addr1)
          .buyTokens(hre.ethers.utils.parseEther("1"), {
            value: hre.ethers.utils.parseEther("0.000001"),
          })
      ).to.be.revertedWith("Wrong amount of ETH sent");
    });

    it("Can buy tokens when sale is active", async function () {
      await hairTokenSale.connect(owner).startSale();

      // Buy 1 token
      await hairTokenSale
        .connect(addr1)
        .buyTokens(hre.ethers.utils.parseEther("1"), {
          value: tokenPrice,
        });

      expect(await hairToken.balanceOf(addr1.address)).to.equal(
        hre.ethers.utils.parseEther("1")
      );
    });
  });

  describe("End Sale", function () {
    it("Owner can end sale, get the ETH and remaining tokens", async function () {
      expect(await hairToken.balanceOf(addr1.address)).to.equal(
        hre.ethers.utils.parseEther("1")
      );

      expect(await hairToken.balanceOf(hairTokenSale.address)).to.equal(
        hre.ethers.utils.parseEther("99")
      );

      expect(
        await hre.ethers.provider.getBalance(hairTokenSale.address)
      ).to.equal(tokenPrice);

      await hairTokenSale.connect(owner).endSale();

      // Expect ETH balance of the contract to be 0
      expect(
        await hre.ethers.provider.getBalance(hairTokenSale.address)
      ).to.equal(0);

      // Expect token balance of the contract to be 0
      expect(await hairToken.balanceOf(hairTokenSale.address)).to.equal(0);
    });
  });
});
