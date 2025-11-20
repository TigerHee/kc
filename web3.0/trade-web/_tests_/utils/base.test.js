import { valIsEmpty } from  "src/utils/base"

describe('valIsEmpty', () => {
  it("'' '  ' null undefined should return true", () => {
    expect(valIsEmpty('')).toBe(true);
    expect(valIsEmpty(' ')).toBe(true);
    expect(valIsEmpty(null)).toBe(true);
    expect(valIsEmpty(undefined)).toBe(true);
  })
  it(" 0 false {}  should return false", () => {
    expect(valIsEmpty(0)).toBe(false);
    expect(valIsEmpty('string')).toBe(false);
    expect(valIsEmpty(false)).toBe(false);
    expect(valIsEmpty([])).toBe(false);
    expect(valIsEmpty({})).toBe(false);
  })
})