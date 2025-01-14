const User = require("../models/User");
const { getOrders } = require("./orderService");
const config = require("../config/config.json");

/**
 * Update user tier based on the number of orders per month.
 * @param {string} username - The username of the user.
 */

const updateTier = async (username) => {
  try {
    const currentMonth = new Date();
    const currentYear = currentMonth.getFullYear();
    const currentMonthNumber = currentMonth.getMonth() + 1;

    const orders = await getOrders(username);

    const currentMonthOrders = orders.find(
      (order) =>
        order._id.year === currentYear && order._id.month === currentMonthNumber
    );

    const orderCount = currentMonthOrders ? currentMonthOrders.orderCount : 0;

    console.log("Order count:", orderCount);

    let tier = "bronze";

    if (orderCount >= config.tiers.silver.minOrders && orderCount < config.tiers.silver.maxOrders) {
      tier = "silver";
    } else if (orderCount >= config.tiers.gold.minOrders) {
      tier = "gold";
    }

    await User.updateOne({ username }, { tier });
  } catch (error) {
    console.error("Error updating tier:", error);
    throw new Error("Failed to update tier");
  }
};

module.exports = {
  updateTier,
};
