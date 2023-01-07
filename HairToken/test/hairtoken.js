const { expect } = require("chai");
const hre = require("hardhat");

describe("HairToken contract", function () {
  let Token;

  // Use parseEther to convert 125000 to wei (just like Ether we use 18 decimals for the token)
  let initialSupply = hre.ethers.utils.parseEther("125000");
  let hairToken;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("HairToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    hairToken = await Token.deploy(initialSupply, owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hairToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hairToken.balanceOf(owner.address);
      expect(await hairToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should mint initial supply", async function () {
      expect(await hairToken.totalSupply()).to.equal(initialSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await hairToken.transfer(addr1.address, 50);
      const addr1Balance = await hairToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hairToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hairToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await hairToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        hairToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await hairToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hairToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await hairToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await hairToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await hairToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await hairToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hairToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
