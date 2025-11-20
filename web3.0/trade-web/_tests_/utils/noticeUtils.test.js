import {
  isMaintenanceScope,
  isSymbolMaintenance,
  isSystemMaintenance,
  isPathFitWithMaintenance,
  isShowMaintenanceNotice,
  isDisableCancelOrder,
} from "src/utils/noticeUtils.js";

describe("isMaintenanceScope", () => {
  it("should returns false if no maintenanceStatus", () => {
    expect(isMaintenanceScope()).toBe(false);
  });

  it("should returns true if pcNoticeLocation equequ Trade", () => {
    const maintenanceStatus = { pcNoticeLocation: "Trade" };
    expect(isMaintenanceScope(maintenanceStatus)).toBe(true);
  });
});

describe("isSymbolMaintenance", () => {
  it("should returns false if no maintenanceStatus", () => {
    expect(isSymbolMaintenance()).toBe(false);
  });

  it("should returns false if no maintenance", () => {
    const maintenanceStatus = { maintenanceScope: 1, symbolList: [] };
    expect(isSymbolMaintenance(maintenanceStatus)).toBe(false);
  });

  it("should returns false if maintenanceScope eqeqeq 1 and no symbolCode", () => {
    const maintenanceStatus = { maintenanceScope: 1, symbolList: [] };

    expect(isSymbolMaintenance(maintenanceStatus)).toBe(false);
  });

  it("should returns true if maintenanceScope eqeqeq 1 and symbolList includes symbolCode", () => {
    const maintenanceStatus = {
      maintenanceScope: 1,
      symbolList: [1, 2],
      maintenance: 2,
    };

    expect(isSymbolMaintenance(maintenanceStatus, 2)).toBe(true);
  });

  it("should returns true if maintenanceScope not eqeqeq 1 and symbolList includes symbolCode", () => {
    const maintenanceStatus = {
      maintenanceScope: 2,
      symbolList: [1, 2],
      maintenance: 2,
    };

    expect(isSymbolMaintenance(maintenanceStatus, 2)).toBe(true);
  });
});

describe("isSystemMaintenance", () => {
  it("should returns false if no maintenanceStatus", () => {
    expect(isSystemMaintenance()).toBe(false);
  });

  it("should returns false if no maintenanceStatus", () => {
    const maintenanceStatus = { pcNoticeLocation: "Trade" };
    expect(isSystemMaintenance(maintenanceStatus)).toBe(false);
  });
});

describe("isPathFitWithMaintenance", () => {
  it("should returns false if pathname includes 404", () => {
    expect(isPathFitWithMaintenance("path/404/")).toBe(false);
  });

  it("should returns true if pathname not includes 404", () => {
    expect(isPathFitWithMaintenance("path/")).toBe(true);
  });
});

describe("isShowMaintenanceNotice", () => {
  it("should returns false if pathname includes 404", () => {
    expect(isShowMaintenanceNotice("path/404/")).toBe(false);
  });

  it("should returns true if pathname not includes 404", () => {
    expect(isShowMaintenanceNotice("path/")).toBe(false);
  });
});

describe("isDisableCancelOrder", () => {
  it("returns false when maintenanceStatus is undefined", () => {
    const maintenanceStatus = undefined;
    const symbolCode = "ETH/USD";
    const actualResult = isDisableCancelOrder(maintenanceStatus)(symbolCode);
    expect(actualResult).toBe(false);
  });

  it("returns false when allowCancelOrder is true", () => {
    const maintenanceStatus = { allowCancelOrder: true };
    const symbolCode = "ETH/USD";
    const actualResult = isDisableCancelOrder(maintenanceStatus)(symbolCode);
    expect(actualResult).toBe(false);
  });
});
