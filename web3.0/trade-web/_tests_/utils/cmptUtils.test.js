import { genComponentCssPath } from "src/utils/cmptUtils.js";

describe("genComponentCssPath", () => {
  it("returns the correct URL with default language", () => {
    const currentLang = "en";
    const componentsToLoad = [["header"], ["footer"]];
    const expectedUrl =
      "/component/css?keys=%5B%22header%40en%22%2C%22header%40en_US%22%2C%22footer%40en%22%2C%22footer%40en_US%22%5D";
    const actualUrl = genComponentCssPath(currentLang, componentsToLoad);
    expect(actualUrl).toEqual(expectedUrl);
  });

  it("returns the correct URL with non-default language", () => {
    const currentLang = "zh";
    const componentsToLoad = [["header"], ["footer"]];
    const expectedUrl =
      "/component/css?keys=%5B%22header%40zh%22%2C%22header%40en_US%22%2C%22footer%40zh%22%2C%22footer%40en_US%22%5D";
    const actualUrl = genComponentCssPath(currentLang, componentsToLoad);
    expect(actualUrl).toEqual(expectedUrl);
  });

  it("returns the correct URL with multiple components and languages", () => {
    const currentLang = "en";
    const componentsToLoad = [["header", "menu"], ["footer"]];
    const expectedUrl =
      "/component/css?keys=%5B%22header%40en%22%2C%22menu%40en%22%2C%22header%40en_US%22%2C%22menu%40en_US%22%2C%22footer%40en%22%2C%22footer%40en_US%22%5D";
    const actualUrl = genComponentCssPath(currentLang, componentsToLoad);
    expect(actualUrl).toEqual(expectedUrl);
  });

  it("returns the correct URL when MAINSITE_HOST is undefined", () => {
    const currentLang = "en";
    const componentsToLoad = [["header"], ["footer"]];
    const expectedUrl =
      "/component/css?keys=%5B%22header%40en%22%2C%22header%40en_US%22%2C%22footer%40en%22%2C%22footer%40en_US%22%5D";
    const siteCfg = { DEFAULT_LANG: "en" };
    const originalSiteCfg = global.siteCfg;
    global.siteCfg = siteCfg;
    const actualUrl = genComponentCssPath(currentLang, componentsToLoad);
    expect(actualUrl).toEqual(expectedUrl);
    global.siteCfg = originalSiteCfg;
  });
});
