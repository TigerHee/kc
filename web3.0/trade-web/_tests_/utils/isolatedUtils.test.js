import {
  currencyAmount2BtcAmount,
  btcAmount2CurrencyAmount,
  getLiabilities,
  getLiquidationPrice,
  getNetAsset,
  getAvailableBalance,
  getEarning,
  getEarningRate,
  getRealLeaverage,
  getMaxBorrowSize,
  getLeveragePoint,
  getTargetPriceSymbolsStr,
} from "src/components/Isolated/utils.js";

describe("currencyAmount2BtcAmount 币种金额通过标记价格转BTC 函数", () => {
  test("currency = BTC", () => {
    expect(currencyAmount2BtcAmount(1, 2, "BTC")).toEqual(1);
  });

  test("currency != BTC", () => {
    expect(currencyAmount2BtcAmount(1, 2, "USDT")).toBe("2");
  });
});

describe("btcAmount2CurrencyAmount BTC金额转币种金额 函数", () => {
  test("amount = 10, price = 2", () => {
    expect(btcAmount2CurrencyAmount(10, 2)).toBe("5");
  });
});

describe("getLiabilities 负债率 函数", () => {
  test("如果 totalLiability 除以 totalBalance 小于 0.0001", () => {
    expect(getLiabilities(1000000, 1)).toBe(0.00001);
  });

  test("如果 totalLiability 除以 totalBalance 大于 0.0001", () => {
    expect(getLiabilities(1, 10000)).toBe("10000");
  });

  test("如果没有参数 则返回 0", () => {
    expect(getLiabilities()).toBe(0);
  });

  test("如果没有 totalBalance 但是有 totalLiability", () => {
    expect(getLiabilities(0, 1000)).toBeNull();
  });

  test("异常数据", () => {
    expect(getLiabilities(100, "abc")).toBeNull();
  });
});

describe("getLiquidationPrice 强平价 函数", () => {
  test("如果 base 币种计算没有 denominator ", () => {
    const flDebtRatio = 0.5;
    const pricePrecision = 2;
    const base = {
      totalBalance: 1000,
      liability: 500,
    };
    const quote = {
      totalBalance: 1000,
      liability: 10000,
    };
    expect(
      getLiquidationPrice(base, quote, flDebtRatio, pricePrecision)
    ).toBeNull();
  });
  test("如果 base 币种计算有 denominator ", () => {
    const flDebtRatio = 0.5;
    const pricePrecision = 2;
    const base = {
      totalBalance: 100,
      liability: 1000,
    };
    const quote = {
      totalBalance: 1000,
      liability: 10000,
    };
    expect(getLiquidationPrice(base, quote, flDebtRatio, pricePrecision)).toBe(
      "-10"
    );
  });

  test("异常数据", () => {
    expect(getLiquidationPrice(100, "abc")).toBeNull();
  });
});

describe("getNetAsset 净资产现值金额 函数", () => {
  test("3 - 2 等于 1", () => {
    expect(getNetAsset(3, 2)).toEqual("1");
  });
  test("1.47 - 2.232 等于 -0.76", () => {
    expect(getNetAsset(1.47, 2.232)).toEqual("-0.762");
  });

  test("异常数据", () => {
    expect(getNetAsset("ab", "c")).toBe(0);
  });
});

describe("getAvailableBalance 可用资产 函数", () => {
  test("总资产小于等于冻结资产", () => {
    expect(getAvailableBalance(1, 10, 2)).toBe(0);
  });

  test("总资产大于冻结资产", () => {
    expect(getAvailableBalance(100, 10, 2)).toBe("90");
  });

  test("异常数据", () => {
    expect(getAvailableBalance("ab", "c")).toBe(0);
  });
});

describe("getEarning 盈亏 函数", () => {
  test("累计本金金额 为空 ", () => {
    expect(getEarning(1)).toBeNull();
  });

  test("盈亏正常逻辑", () => {
    expect(getEarning(100, 10)).toBe(90);
  });

  test("异常数据", () => {
    expect(getEarning("ab", "c")).toBeNull();
  });
});

describe("getEarningRate 收益率 函数", () => {
  test("如果没有累计本金金额", () => {
    expect(getEarningRate()).toBeNull();
  });

  test("如果没有累计本金金额为非数字", () => {
    expect(getEarningRate(1, "asd")).toBe(0);
  });

  test("收益率正常逻辑", () => {
    expect(getEarningRate(100, 10)).toBe(10);
  });

  test("异常数据", () => {
    expect(getEarningRate("abc", 100)).toBe(0);
  });
});

describe("getRealLeaverage 实际杠杆倍数 函数", () => {
  test("如果没有净资产 ", () => {
    expect(getRealLeaverage(1)).toBe(0);
  });

  test("正常逻辑", () => {
    expect(getRealLeaverage(100, 10)).toBe("10");
  });

  test("异常数据", () => {
    expect(getRealLeaverage("ab", 100)).toBe(0);
  });
});

describe("getMaxBorrowSize 计算币种可借入数量 函数", () => {
  test("用户杠杆倍数 userLeverage 小于 1", () => {
    const coin = {
      liability: 100,
      targetPrice: 200,
      borrowMaxAmount: 300,
      borrowMinAmount: 400,
      currencyLoanMinUnit: 500,
    };
    const params = {
      coin,
      netAsset: 1000,
      userLeverage: 1,
      quoteIsSelf: 300,
      totalLiability: 400,
    };

    expect(getMaxBorrowSize(params)).toBe(0);
  });

  test("如果没有 quoteIsSelf 和 targetPrice", () => {
    const coin = {
      liability: 100,
      targetPrice: 0,
      borrowMaxAmount: 300,
      borrowMinAmount: 400,
      currencyLoanMinUnit: 500,
    };
    const params = {
      coin,
      netAsset: 1000,
      userLeverage: 10,
      quoteIsSelf: 0,
      totalLiability: 400,
    };

    expect(getMaxBorrowSize(params)).toBe(0);
  });

  test("如果没有 quoteIsSelf 但是有 targetPrice", () => {
    const coin = {
      liability: 100,
      targetPrice: 10,
      borrowMaxAmount: 300,
      borrowMinAmount: 10000,
      currencyLoanMinUnit: 500,
    };
    const params = {
      coin,
      netAsset: 10000,
      userLeverage: 10,
      quoteIsSelf: 0,
      totalLiability: 400,
    };

    expect(getMaxBorrowSize(params)).toBe(0);
  });

  test("如果有 quoteIsSelf", () => {
    const coin = {
      liability: 100,
      targetPrice: 10,
      borrowMaxAmount: 3000,
      borrowMinAmount: 400,
      currencyLoanMinUnit: 500,
    };
    const params = {
      coin,
      netAsset: 1000,
      userLeverage: 10,
      quoteIsSelf: 100,
      totalLiability: 400,
    };

    expect(getMaxBorrowSize(params)).toBe("2500");
  });

  test("如果有 quoteIsSelf 且 小于 borrowMinAmount", () => {
    const coin = {
      liability: 100,
      targetPrice: 10,
      borrowMaxAmount: 3000,
      borrowMinAmount: 4000,
      currencyLoanMinUnit: 500,
    };
    const params = {
      coin,
      netAsset: 1000,
      userLeverage: 10,
      quoteIsSelf: 100,
      totalLiability: 400,
    };

    expect(getMaxBorrowSize(params)).toBe(0);
  });

  test("异常数据", () => {
    expect(getMaxBorrowSize("ab", "c")).toBe(0);
  });
});

describe("getLeveragePoint 滑动条单节点数值计算 函数", () => {
  test("如果 没有 maxLeverage ", () => {
    expect(getLeveragePoint()).toEqual([]);
  });

  test("如果 maxLeverage <= 5 并且是整数", () => {
    expect(getLeveragePoint(5)).toEqual([1, 2, 3, 4, 5]);
  });

  test("如果 maxLeverage <= 5 并且是浮点数", () => {
    expect(getLeveragePoint(4.5)).toEqual([1, 2, 3, 4, 4.5]);
  });

  test("如果 result.length < 4", () => {
    expect(getLeveragePoint(6, [1, 2])).toEqual([1, 2, 3, 4, 6]);
  });

  test("正常逻辑", () => {
    expect(getLeveragePoint(5)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("getTargetPriceSymbolsStr 获取需要监听标记价格推送的交易对 函数", () => {
  test("如果不是 Array", () => {
    expect(getTargetPriceSymbolsStr()).toBe("");
  });

  test("如果数组不包含 BTC", () => {
    const arr = ["ETH", "USDT"];
    expect(getTargetPriceSymbolsStr(arr)).toBe("ETH-BTC,USDT-BTC");
  });

  test("如果数组包含 BTC", () => {
    const arr = ["ETH", "USDT", "BTC"];
    expect(getTargetPriceSymbolsStr(arr)).toBe("ETH-BTC,USDT-BTC");
  });
});
