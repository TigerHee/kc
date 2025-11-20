import {
  checkIsMarginAccount,
  STATUS,
} from "src/components/KcTransferModal/config.js";

describe("checkIsMarginAccount", () => {
  it("returns true if account code is margin or isolated", () => {
    expect(checkIsMarginAccount("margin")).toBe(false);
    expect(checkIsMarginAccount("isolated")).toBe(false);
  });

  it("returns false if account code is not margin or isolated", () => {
    expect(checkIsMarginAccount("spot")).toBe(false);
    expect(checkIsMarginAccount("")).toBe(false);
    expect(checkIsMarginAccount(null)).toBe(false);
    expect(checkIsMarginAccount(undefined)).toBe(false);
  });
});

describe("STATUS", () => {
  it("STATUS MARGIN", () => {
    const { FROZEN_RENEW, FROZEN_FL, LIABILITY } = STATUS.MARGIN;
    expect(FROZEN_RENEW.label()).toBe("margin.renewing");
    expect(FROZEN_RENEW.tipInOrderList()).toBe("margin.system.renewing");

    expect(FROZEN_FL.label()).toBe("margin.liquidating");
    expect(FROZEN_FL.tipInOrderList()).toBe("margin.system.operating");
    expect(FROZEN_FL.desc()).toBe("liquidated.warning");

    expect(LIABILITY.label()).toBe("status.negativeBalance");
    expect(LIABILITY.desc()).toBe("negativeBalance.warning");
  });

  it("STATUS ISOLATED", () => {
    const {
      IN_BORROW,
      BANKRUPTCY,
      LIABILITY,
      IN_REPAY,
      IN_LIQUIDATION,
      IN_AUTO_RENEW,
    } = STATUS.ISOLATED;
    expect(IN_BORROW.label()).toBe("status.borrowing");
    expect(IN_REPAY.label()).toBe("status.repaying");

    expect(BANKRUPTCY.label()).toBe("status.negativeBalance");
    expect(BANKRUPTCY.desc()).toBe("negativeBalance.warning");

    expect(LIABILITY.label()).toBe("status.negativeBalance");
    expect(LIABILITY.desc()).toBe("negativeBalance.warning");

    expect(IN_LIQUIDATION.label()).toBe("margin.liquidating");
    expect(IN_LIQUIDATION.desc()).toBe("liquidated.warning");
    expect(IN_LIQUIDATION.tipInOrderList()).toBe("margin.system.operating");

    expect(IN_AUTO_RENEW.label()).toBe("margin.renewing");
    expect(IN_AUTO_RENEW.tipInOrderList()).toBe("margin.system.renewing");
  });
});

