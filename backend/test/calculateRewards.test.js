const { calculateReward } = require('../utils/calculateReward');

describe("calculateReward", () => {
    it("should return the correct reward for a Bronze user with an order <= $100", () => {
      const result = calculateReward("bronze", 50);
      expect(result).toBe(50); // 50 * 1 (bronze multiplier) * 1 (order multiplier)
    });
  
    it("should return the correct reward for a Silver user with an order <= $100", () => {
      const result = calculateReward("silver", 50);
      expect(result).toBe(60); // 50 * 1.2 (silver multiplier) * 1 (order multiplier)
    });
  
    it("should return the correct reward for a Gold user with an order <= $100", () => {
      const result = calculateReward("gold", 50);
      expect(result).toBe(75); // 50 * 1.5 (gold multiplier) * 1 (order multiplier)
    });
  
    it("should apply the order multiplier for orders > $100 for a Bronze user", () => {
      const result = calculateReward("bronze", 150);
      expect(result).toBe(300); // 150 * 1 (bronze multiplier) * 2 (order multiplier)
    });
  
    it("should apply both multipliers for a Silver user with an order > $100", () => {
      const result = calculateReward("silver", 150);
      expect(result).toBe(360); // 150 * 1.2 (silver multiplier) * 2 (order multiplier)
    });
  
    it("should apply both multipliers for a Gold user with an order > $100", () => {
      const result = calculateReward("gold", 200);
      expect(result).toBe(600); // 200 * 1.5 (gold multiplier) * 2 (order multiplier)
    });
  
    it("should return 0 for invalid order amounts", () => {
      const result = calculateReward("gold", 0);
      expect(result).toBe(0);
    });
  
    it("should default to Bronze tier if the tier is invalid", () => {
      const result = calculateReward("invalidTier", 100);
      expect(result).toBe(100); // 100 * 1 (default bronze multiplier) * 1 (order multiplier)
    });
  
    it("should return 0 for negative order amounts", () => {
      const result = calculateReward("silver", -50);
      expect(result).toBe(0);
    });
  });