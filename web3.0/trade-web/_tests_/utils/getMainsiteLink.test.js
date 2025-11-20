import getMainsiteLink, {
  updateQueryStringParameter,
  formatUrlWithLang,
} from "src/utils/getMainsiteLink.js";

describe("updateQueryStringParameter", () => {
  it("should update an existing parameter", () => {
    const uri = "https://example.com/?foo=bar&baz=qux";
    const key = "foo";
    const value = "new";
    const updatedUri = updateQueryStringParameter(uri, key, value);
    expect(updatedUri).toBe("https://example.com/?foo=new&baz=qux");
  });

  it("should add a new parameter if it does not exist", () => {
    const uri = "https://example.com/?foo=bar";
    const key = "baz";
    const value = "qux";
    const updatedUri = updateQueryStringParameter(uri, key, value);
    expect(updatedUri).toBe("https://example.com/?foo=bar&baz=qux");
  });

  it("should return the original URI if the value is empty", () => {
    const uri = "https://example.com/?foo=bar";
    const key = "baz";
    const value = "";
    const updatedUri = updateQueryStringParameter(uri, key, value);
    expect(updatedUri).toBe(uri);
  });

  it("should return the original URI if the URI is empty", () => {
    const uri = "";
    const key = "baz";
    const value = "qux";
    const updatedUri = updateQueryStringParameter(uri, key, value);
    expect(updatedUri).toBe(uri);
  });
});

const originUrl = "https://example.com/pathname?foo=bar";
const lang = "en_US";

describe("formatUrlWithLang", () => {
  test("returns URL with lang parameter when no lang is provided", () => {
    const formattedUrl = formatUrlWithLang(originUrl);

    expect(formattedUrl).toEqual(
      "https://example.com/pathname?foo=bar&lang=en_US"
    );
  });

  test("returns URL with lang parameter when lang is provided", () => {
    const formattedUrl = formatUrlWithLang(originUrl, lang);
    const expectedUrl = `${originUrl}&lang=${lang}`;

    expect(formattedUrl).toEqual(expectedUrl);
  });

  test("returns URL with lang parameter from language store", () => {
    const formattedUrl = formatUrlWithLang(originUrl);
    const expectedUrl = `${originUrl}&lang=${lang}`;

    expect(formattedUrl).toEqual(expectedUrl);
  });

  test("returns URL with lang parameter from language store when no lang is provided", () => {
    const formattedUrl = formatUrlWithLang(originUrl);
    const expectedUrl = `${originUrl}&lang=${lang}`;

    expect(formattedUrl).toEqual(expectedUrl);
  });

  test("returns URL with lang parameter from URL pathname", () => {
    const formattedUrl = formatUrlWithLang(originUrl);
    const expectedUrl = `${originUrl}&lang=${lang}`;

    expect(formattedUrl).toEqual(expectedUrl);
  });
});

describe("getMainsiteLink", () => {

  it("should return correct urls with language", () => {
    const expected = {
      loginUrl: `undefined/ucenter/signin?back=http%253A%252F%252Flocalhost%252F`,
      registerUrl: `undefined/ucenter/signup?backUrl=http%253A%252F%252Flocalhost%252F`,
      assetPwdUrl: `undefined/account/security/protect`,
      assetsUrl: `undefined/assets`,
      accountUrl: `undefined/account`,
    };
    expect(getMainsiteLink()).toEqual(expected);
  });
});
