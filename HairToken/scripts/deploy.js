const hre = require("hardhat");

async function main() {
  const HairToken = await hre.ethers.getContractFactory("HairToken");
  const hairToken = await HairToken.deploy(30000000, 50);

  await hairToken.deployed();

  console.log("Hair Token Successfully deployed: ", hairToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
