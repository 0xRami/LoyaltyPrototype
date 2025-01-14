const tokenService = require("../services/tokenService");
const User = require("../models/User");
const axios = require("axios");

const getBalance = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const walletAddress = user.wallet_address;

    const balance = await tokenService.getBalance(walletAddress);

    res
      .status(200)
      .json({ balance });
  } catch (error) {
    console.error("Error getting balance:", error);
    res.status(500).json({ error: error.message });
  }
};

const withdraw = async(req, res) => {
  try {
    const {username, amount, withdrawTo, currency} = req.body;

    if(!amount || !username || !withdrawTo) {
      return res.status(400).json({message: "Invalid request"});
    }

    if(amount <= 0) {
      return res.status(400).json({message: "Invalid amount"});
    }

    if(currency !== "USDT" && currency !== "ETH") {
      return res.status(400).json({message: "Invalid currency value. Must be ETH or USDT"});
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const txHash = await tokenService.convertPoints(amount, currency, user.private_key, withdrawTo);

    res.status(200).json({txHash});
  } catch (error) {
    console.error("Error withdrawing tokens:", error);
    res.status(500).json({error: error.message});
  }
}

const withdrawFiatToCrypto = async (req, res) => {
  try {
    const {username, fiatAmount, currency, crypto, withdrawTo} = req.body;

    if(!fiatAmount || !username || !withdrawTo) {
      return res.status(400).json({message: "Invalid request"});
    }

    if(fiatAmount <= 0) {
      return res.status(400).json({message: "Invalid amount"});
    }

    if(crypto !== "USDT") {
      return res.status(400).json({message: "Invalid currency value. Must be USDT"});
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //simulate getting exchange rate from an API
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${currency.toLowerCase()}`;
    const response = await axios.get(url);

    const exchangeRate = response.data.tether[currency.toLowerCase()];
    const amount = fiatAmount / exchangeRate;

    const tx = await tokenService.mintUSDT(amount, withdrawTo);
    
    res.status(200).json({message: `Successfully withdrew ${fiatAmount} ${currency} to ${amount.toFixed(4)} ${crypto}`, tx});
  } catch (error) {
    console.error("Error withdrawing tokens:", error);
    res.status(500).json({error: error.message});
  }
}

module.exports = {
    getBalance,
    withdraw,
    withdrawFiatToCrypto
};