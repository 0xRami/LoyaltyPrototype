const tokenService = require("../services/tokenService");
const User = require("../models/User");
const { calculateReward } = require("../utils/calculateReward");
const { saveOrder } = require("../services/orderService");
const { updateTier } = require("../services/userService");

/**
 * Place an order and mint loyalty tokens based on the order amount.
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username placing the order.
 * @param {number} req.body.orderAmount - The total amount of the order.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Responds with a success message and transaction hash, or an error message.
 * @throws {Error} Throws an error if order placement or token minting fails.
 */
const placeOrder = async (req, res) => {
  try {
    const { username, orderAmount } = req.body;

    if (!username || !orderAmount) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //save order in database
    await saveOrder(username, orderAmount);

    //potentially update user tier depending on order count per month
    await updateTier(username);

    //calculate reward points based on user tier and order amount
    const points = calculateReward(user.tier, orderAmount);

    const walletAddress = user.wallet_address;

    //mint tokens
    const txHash = await tokenService.mintTokens(Math.ceil(points), walletAddress);

    res
      .status(200)
      .json({ message: `Order placed successfully. You were awarded ${Math.ceil(points)} Loyalty Tokens.`, transactionHash: txHash });
  } catch (error) {
    console.error("Error minting tokens:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  placeOrder,
};
