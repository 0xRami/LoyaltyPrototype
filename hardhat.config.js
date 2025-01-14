require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28", // For contracts using ^0.8.28
      },
      {
        version: "0.7.6", // For contracts using ^0.7.6
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};
