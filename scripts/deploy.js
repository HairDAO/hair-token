const hre = require("hardhat");

async function main() {
  // The daoWallet address will probably be the multisig address when deploying to mainnet
  [deployer, daoWallet] = await hre.ethers.getSigners();
  let tokenPrice = hre.ethers.utils.parseEther("0.0007");

  const HairTokenFactory = await hre.ethers.getContractFactory("HairToken");
  const hairToken = await HairTokenFactory.deploy(
    hre.ethers.utils.parseEther("125000"),
    daoWallet.address
  );

  await hairToken.deployed();

  console.log("Deployer address: ", deployer.address);
  console.log("DAO wallet address: ", daoWallet.address);

  console.log("---");

  console.log("Hair Token successfully deployed at: ", hairToken.address);
  console.log("125000 Hair Tokens minted to: ", deployer.address);

  const HairTokenSaleFactory = await hre.ethers.getContractFactory(
    "HairTokenSale"
  );
  const hairTokenSale = await HairTokenSaleFactory.deploy(
    hairToken.address,
    tokenPrice
  );
  await hairTokenSale.deployed();

  console.log("---");
  console.log(
    "Sales contract successfully deployed at: ",
    hairTokenSale.address
  );

  console.log("---");
  // Transfer ownership of token contract to DAO wallet
  await hairToken.transferOwnership(daoWallet.address);
  console.log(
    "Ownership of Hair Token contract transferred to: ",
    daoWallet.address
  );

  // Transfer ownership of sales contract to DAO wallet
  await hairTokenSale.transferOwnership(daoWallet.address);
  console.log(
    "Ownership of Sales contract transferred to: ",
    daoWallet.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
