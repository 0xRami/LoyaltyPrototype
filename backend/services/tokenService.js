const { web3, account } = require("../utils/web3Provider");
const fs = require("fs");
const config = require("../config/config.json");

// Load the ABI from the compiled smart contract JSON
const contractABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/Token.sol/Token.json", "utf8")
).abi;
const swapABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/TokenSwap.sol/TokenSwap.json", "utf8")
).abi;
const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
const tokenSwapContractAddress = process.env.TOKEN_SWAP_CONTRACT;

console.log("Contract Address:", tokenSwapContractAddress);

// Initialize the token contract instance
const tokenContract = new web3.eth.Contract(contractABI, contractAddress);

const usdtABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "receiver", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "_mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const usdtContract = new web3.eth.Contract(usdtABI, config.crypto.USDT); 
const tokenSwapContract = new web3.eth.Contract(
  swapABI,
  tokenSwapContractAddress
);

/**
 * Mints tokens to a specified address.
 * @param {number|string} amount - The amount of tokens to mint (in ether units).
 * @param {string} to - The Ethereum address to mint the tokens to.
 * @returns {string} The transaction hash of the mint operation.
 * @throws {Error} Throws an error if the minting process fails.
 */
const mintTokens = async (amount, to) => {
  try {
    const mintAmount = web3.utils.toWei(amount.toString(), "ether");

    const tx = await tokenContract.methods.mint(to, mintAmount).send({
      from: account.address,
      gas: 3000000,
    });

    console.log("Mint Transaction Hash:", tx.transactionHash);
    return tx.transactionHash;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to mint tokens");
  }
};

/**
 * Mints tokens to a specified address.
 * @param {number|string} amount - The amount of tokens to mint (in ether units).
 * @param {string} to - The Ethereum address to mint the tokens to.
 * @returns {string} The transaction hash of the mint operation.
 * @throws {Error} Throws an error if the minting process fails.
 */
const mintUSDT = async (amount, to) => {
  try {
    const mintAmount = web3.utils.toWei(amount.toString(), "ether");

    const tx = await usdtContract.methods._mint(to, mintAmount).send({
      from: account.address,
      gas: 3000000,
    });

    console.log("Mint Transaction Hash:", tx.transactionHash);
    return tx.transactionHash;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to mint tokens");
  }
};


/**
 * Retrieves the balance of a specified address.
 * @param {string} address - The Ethereum address whose token balance is to be fetched.
 * @returns {string} The balance of the address in ether units.
 * @throws {Error} Throws an error if the balance retrieval process fails.
 */
const getBalance = async (address) => {
  try {
    const balance = await tokenContract.methods.balanceOf(address).call();
    const balanceString = balance.toString();
    return web3.utils.fromWei(balanceString, "ether");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get balance");
  }
};

/**
 * Approve for the token swap contract to use the tokens.
 * @param {string} amount
 */
const approveTokens = async (amount, address) => {
  try {
    const tx = await tokenContract.methods
      .approve(tokenSwapContractAddress, amount)
      .send({
        from: address,
        gas: 100000,
      });
    console.log("Approval Transaction Hash:", tx.transactionHash);
  } catch (error) {
    console.error("Approval Failed:", error);
    throw new Error("Failed to approve tokens");
  }
};

/**
 * Converts points (tokens) to ETH using Uniswap V3.
 * @param {number|string} amount - The amount of tokens to convert (in Ether units).
 * @returns {string} The transaction hash of the swap operation.
 */
const convertPoints = async (amount, currency, from, to) => {
  try {
    const fromAccount = web3.eth.accounts.privateKeyToAccount(from);
    web3.eth.accounts.wallet.add(fromAccount);

    const amountIn = web3.utils.toWei(amount.toString(), "ether");

    await approveTokens(amountIn, fromAccount.address);

    //Call contract to execute the swap
    const tx = await tokenSwapContract.methods
      .swapExactInputSingle(amountIn, config.crypto[currency], to)
      .send({
        from: fromAccount.address,
        gas: 500000,
      });

    console.log("Swap Transaction Hash:", tx.transactionHash);
    return tx.transactionHash;
  } catch (error) {
    console.error("Swap Failed:", error);
    throw new Error("Failed to convert points to ETH");
  }
};

/**
 * Create wallet for user and fund it for testing
 * @returns {Object} The wallet address and private key of the newly created wallet. 
 */
const createWallet = async () => {
  const wallet = web3.eth.accounts.create();
  const walletAddress = wallet.address;
  const privateKey = wallet.privateKey;

  const fundingAmount = web3.utils.toWei("0.01", "ether"); // Amount of ETH to send

  const tx = await web3.eth.sendTransaction({
    from: account.address, // Main account sending the funds
    to: walletAddress, // Newly created wallet receiving ETH
    value: fundingAmount, // Amount in Wei
    gas: 21000, // Gas limit for a simple ETH transfer
  });

  return {walletAddress, privateKey};
};


module.exports = {
  mintTokens,
  mintUSDT,
  getBalance,
  convertPoints,
  createWallet
};
