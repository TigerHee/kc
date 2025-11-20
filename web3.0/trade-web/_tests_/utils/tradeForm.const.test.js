import {
  isTriggerTrade,
  shouldOpenOrderTips,
  TRADE_DIRECTION,
  LearnMoreFeeLinks,
} from "src/pages/Trade3.0/components/TradeBox/TradeForm/const.js";

describe("isTriggerTrade", () => {
  it("should return false when TrType is aa", () => {
    expect(isTriggerTrade("aaa")).toBe(false);
  });

  it("should return true when TrType is triggerprise", () => {
    expect(isTriggerTrade("triggerprise")).toBe(true);
  });
});

describe("LearnMoreFeeLinks", () => {
  it("should return false when LearnMoreFeeLinks.zh_CN excute", () => {
    expect(LearnMoreFeeLinks.zh_CN()).toContain("/news/fe");
  });

  it("should return false when LearnMoreFeeLinks.en_US excute", () => {
    expect(LearnMoreFeeLinks.en_US()).toContain("/news/en-fee");
  });

  it("should return false when LearnMoreFeeLinks.default excute", () => {
    expect(LearnMoreFeeLinks.default()).toContain("/news/en-fee");
  });
});

describe("shouldOpenOrderTips", () => {
  const targetPrice = "100";
  const lowestSellPrice = "95";
  const highestBuyPrice = "105";
  const percent = 0.05;

  it("should return false for buy orders when lowest sell price is greater than the target price plus the percent increase", () => {
    const side = TRADE_DIRECTION.BUY;
    const result = shouldOpenOrderTips({
      side,
      targetPrice,
      lowestSellPrice,
      highestBuyPrice,
      percent,
    });
    expect(result).toBe(false);
  });

  it("should return false for sell orders when target price is greater than the highest buy price plus the percent increase", () => {
    const side = TRADE_DIRECTION.SELL;
    const result = shouldOpenOrderTips({
      side,
      targetPrice,
      lowestSellPrice,
      highestBuyPrice,
      percent,
    });
    expect(result).toBe(false);
  });

  it("should return false when the side is not buy or sell", () => {
    const side = "foo";
    const result = shouldOpenOrderTips({
      side,
      targetPrice,
      lowestSellPrice,
      highestBuyPrice,
      percent,
    });
    expect(result).toBe(false);
  });

  it("should return false when an error occurs during calculation", () => {
    const side = TRADE_DIRECTION.BUY;
    const targetPrice = "invalid";
    const result = shouldOpenOrderTips({
      side,
      targetPrice,
      lowestSellPrice,
      highestBuyPrice,
      percent,
    });
    expect(result).toBe(false);
  });
});
