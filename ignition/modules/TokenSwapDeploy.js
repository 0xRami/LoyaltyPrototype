// Import Hardhat runtime environment
const hre = require("hardhat");

async function main() {
  // Deploy parameters
  const ROUTER_ADDRESS = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";

  // Compile contracts (ensures the latest build is used)
  await hre.run("compile");

  // Get the contract factory
  const TokenSwap = await hre.ethers.getContractFactory("TokenSwap");

  // Deploy the contract
  const tokenSwap = await TokenSwap.deploy(ROUTER_ADDRESS);

  console.log(`TokenSwap deployed to: ${await tokenSwap.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });