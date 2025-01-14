const Order = require("../models/Order");

/**
 * Save an order to the database.
 * @param {string} username - The username associated with the order.
 * @param {number} orderAmount - The amount of the order.
 * @returns {Promise<void>}
 */
const saveOrder = async (username, orderAmount) => {
  try {
    const order = new Order({
      username,
      amount: orderAmount,
      createdAt: new Date(),
    });

    await order.save();
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Failed to save order");
  }
};
/**
 * Retrieve the number of orders grouped by month for a specific user.
 * @param {string} username - The username to retrieve orders for.
 * @returns {Promise<Array<Object>>} An array of orders grouped by year and month with order counts.
 * @throws {Error} Throws an error if retrieving the orders fails.
 */
const getOrders = async (username) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: { username }, // Filter orders by username
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          orderCount: { $sum: 1 }, // Count orders per month
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }, // Sort by most recent month
      },
    ]);

    return orders;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw new Error("Failed to get orders");
  }
};

module.exports = {
  saveOrder,
  getOrders
};
