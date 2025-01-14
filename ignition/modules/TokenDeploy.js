// Import Hardhat runtime environment
const hre = require("hardhat");

async function main() {
  // Deploy parameters
  const TOKEN_NAME = "LoyaltyToken";
  const TOKEN_SYMBOL = "LT";

  // Compile contracts (ensures the latest build is used)
  await hre.run("compile");

  // Get the contract factory
  const Token = await hre.ethers.getContractFactory("Token");

  // Deploy the contract
  const token = await Token.deploy(TOKEN_NAME, TOKEN_SYMBOL, 18);

  console.log(`Token deployed to: ${await token.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });