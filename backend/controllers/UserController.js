const User = require("../models/User");
const { createWallet } = require("../services/tokenService");
const { web3, account } = require("../utils/web3Provider");

/**
 * Create a new user in the database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.wallet_address - The wallet address of the new user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Responds with a success or error message.
 */
const createUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const {walletAddress, privateKey} = await createWallet();
    
    const newUser = new User({
      username,
      wallet_address: walletAddress,
      private_key: privateKey, // only for prototype purposes save in db
      tier: "bronze",
    });

    await newUser.save();

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve user information from the database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The route parameters of the request.
 * @param {string} req.params.username - The username to retrieve.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Responds with the user data or an error message.
 */
const getUser = async (req, res) => {
    try {
        const { username } = req.params;
    
        if (!username) {
        return res.status(400).json({ message: "Invalid request" });
        }
    
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    }catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createUser,
    getUser
};