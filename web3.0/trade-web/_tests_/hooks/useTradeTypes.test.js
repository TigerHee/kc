import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithHook } from "_tests_/test-setup";
import useTradeTypes, {
  checkIsBotsMode,
  MarginSensors,
  TRADE_TYPES_CONFIG,
} from "src/utils/hooks/useTradeTypes.js";

afterEach(cleanup);

describe("useTradeTypes", () => {
  it("should return an array of trade types", () => {
    const { result } = renderWithHook(() => useTradeTypes("BTC-USDT"));

    expect(result.current).toEqual(["TRADE"]);
  });
  // Add more test cases as needed
});

describe("checkIsBotsMode", () => {
  it("should return true for grid trade type", () => {
    expect(checkIsBotsMode("GRID")).toBe(true);
  });

  it("should return false for other trade types", () => {
    expect(checkIsBotsMode("spot")).toBe(false);
    expect(checkIsBotsMode("margin")).toBe(false);
  });
});

describe("MarginSensors", () => {
  it("should call sensorsFunc with arguments", () => {
    expect(MarginSensors("MARGIN_ISOLATED_TRADE")).toBeUndefined();
  });
});

describe("TRADE_TYPES_CONFIG", () => {
  it("TRADE_TYPES_CONFIG TRADE ", () => {
    const { TRADE } = TRADE_TYPES_CONFIG;
    expect(TRADE.label1()).toBe("tradeType.trade");
    expect(TRADE.label2()).toBe("tradeType.trade");
    expect(TRADE.initDict()).toEqual([["MAIN"], ["TRADE"]]);
    expect(TRADE.validateOcoFunc()).toBeUndefined();
    expect(TRADE.gaFunc.transferOkButton()).toBeUndefined();
    expect(TRADE.gaFunc.transferButton()).toBeUndefined();
    expect(TRADE.gaFunc.shiftCategory()).toBeUndefined();
    expect(
      TRADE.gaFunc.buyButton({ currentSymbol: "BTC-USDT", orderType: 0 })
    ).toBeUndefined();
    expect(
      TRADE.gaFunc.sellButton({ currentSymbol: "BTC-USDT", orderType: 0 })
    ).toBeUndefined();
    expect(
      TRADE.checkIsForbiddenTrade({ currentSymbol: "BTC-USDT", orderType: 0 })
    ).toBeFalsy();
  });

  it("TRADE_TYPES_CONFIG MARGIN_TRADE ", () => {
    const { MARGIN_TRADE } = TRADE_TYPES_CONFIG;
    expect(MARGIN_TRADE.label1()).toBe("cross");
    expect(MARGIN_TRADE.label2()).toBe("crossMargin");
    expect(MARGIN_TRADE.accountName()).toBe("crossMargin.account");
    expect(MARGIN_TRADE.iconText("zh_CN")).toBe("全");
    expect(MARGIN_TRADE.multiDescTitle({})).toBe("newAssets.crossMargin.title");
    expect(MARGIN_TRADE.multiDesc()).toEqual("cross.multi.desc");
    expect(MARGIN_TRADE.noBalanceTip()).toEqual("cross.position.noBalance");
    expect(MARGIN_TRADE.initDict()).toEqual([["TRADE"], ["MARGIN"]]);

    expect(
      MARGIN_TRADE.checkIsForbiddenTrade({
        currentSymbol: "BTC-USDT",
        orderType: 0,
      })
    ).toBeFalsy();
  });

  it("TRADE_TYPES_CONFIG MARGIN_ISOLATED_TRADE ", () => {
    const { MARGIN_ISOLATED_TRADE } = TRADE_TYPES_CONFIG;
    expect(MARGIN_ISOLATED_TRADE.label1()).toBe("isolated");
    expect(MARGIN_ISOLATED_TRADE.label2()).toBe("isolatedMargin");
    expect(MARGIN_ISOLATED_TRADE.accountName()).toBe("isolatedMargin.account");
    expect(MARGIN_ISOLATED_TRADE.iconText("zh_CN")).toBe("逐");
    expect(MARGIN_ISOLATED_TRADE.multiDescTitle({})).toBe(
      "isolated.isolated.multi"
    );
    expect(MARGIN_ISOLATED_TRADE.multiDesc()).toEqual("isolated.multi.desc");
    expect(MARGIN_ISOLATED_TRADE.noBalanceTip()).toEqual(
      "isolated.position.noBalance"
    );
    expect(MARGIN_ISOLATED_TRADE.initDict()).toEqual([["TRADE"], ["ISOLATED", undefined]]);
    expect(
      MARGIN_ISOLATED_TRADE.checkIsForbiddenTrade({
        currentSymbol: "BTC-USDT",
        orderType: 0,
      })
    ).toBeFalsy();
  });

  it("TRADE_TYPES_CONFIG GRID ", () => {
    const { GRID } = TRADE_TYPES_CONFIG;
    expect(GRID.label()).toBe("tradeType.spotGrid");
    expect(GRID.label1()).toBe("tradeType.spotGrid");
    expect(GRID.initDict()).toEqual([["MAIN"], ["TRADE"]]);
  });
});
