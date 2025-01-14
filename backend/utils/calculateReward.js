const config = require('../config/config.json');

/**
 * Calculate the reward points based on the tier and order amount for gamification
 * @param {bronze|silver|gold} tier - The tier of the user 
 * @param {Integer} orderAmount - The amount of the order
 * @returns {Integer} - The reward points
 */
const calculateReward = (tier, orderAmount) => {
    if(orderAmount <= 0){
        return 0;
    }
    
    let tierMultiplier = config.tiers[tier]?.multiplier || 1;
    let orderMulitplier = 1;

    if(orderAmount > config.rewards.orderThreshold){
        orderMulitplier = config.rewards.highOrderMultiplier;
    }

    return tierMultiplier * orderMulitplier * orderAmount;
}

module.exports = {
    calculateReward
}