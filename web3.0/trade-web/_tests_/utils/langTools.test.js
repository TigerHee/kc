import { isRTLLanguage } from "src/utils/langTools.js";

describe("isRTLLanguage", () => {
  it("should returns false for a non-RTL language", () => {
    expect(isRTLLanguage("en_US")).toBe(false);
  });

  it("should returns true for a RTL language", () => {
    expect(isRTLLanguage("ar_AE")).toBe(true);
  });

  it("returns true for null or undefined lang param and the current language is an RTL language", () => {
    jest
      .spyOn(require("utils/lang"), "getCurrentLangFromPath")
      .mockReturnValue("ar_AE");
    const result = isRTLLanguage(null);
    expect(result).toBe(true);
  });

  it("returns false for null or undefined lang param and the current language is not an RTL language", () => {
    jest
      .spyOn(require("utils/lang"), "getCurrentLangFromPath")
      .mockReturnValue("en_US");
    const result = isRTLLanguage(null);
    expect(result).toBe(false);
  });
});
