import localStorage from "src/utils/memStorage";

describe("localStorage", () => {
  beforeEach(() => {
    localStorage.setItem("foo", "bar");
  });

  afterEach(() => {
    localStorage.removeItem("foo");
  });

  test("setItem should save data in storage", () => {
    const key = "foo";
    const data = "baz";
    localStorage.setItem(key, data);
    expect(localStorage.getItem(key)).toBe(data);
  });

  test("getItem should return null if data is not in storage", () => {
    const key = "notExist";
    expect(localStorage.getItem(key)).toBeNull();
  });

  test("getItem should return data if data is in storage", () => {
    const key = "foo";
    expect(localStorage.getItem(key)).toBe("bar");
  });

  test("removeItem should remove data from storage", () => {
    const key = "foo";
    localStorage.removeItem(key);
    expect(localStorage.getItem(key)).toBeNull();
  });
});
