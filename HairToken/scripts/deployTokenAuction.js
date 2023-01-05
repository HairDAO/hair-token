const hre = require("hardhat");
const HairToken = artifacts.require("./HairToken.sol");
const HairTokenSale = artifacts.require("./Hair_Auction.sol");

async function main() {
  const HairToken = await hre.ethers.getContractFactory("HairToken");
  const hairToken = await HairToken.deploy(125000);
  const HairTokenSale = await hre.ethers.getContractFactory("HairTokenSale");
  const hairTokenSale = await HairTokenSale.deploy(hairToken.address, 320000);

  await hairToken.deployed();
  await hairTokenSale.deployed();

  console.log("Hair Token Successfully deployed: ", hairToken.address);
  console.log("Hair Auction Successfully deployed: ", hairTokenSale.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
