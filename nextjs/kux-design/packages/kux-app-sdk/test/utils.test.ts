import { isGlobalObject, searchToJson, globalObject,
  isDeepEqual, noop, param,
  compareVersion, waitForINP } from '../src/utils'

describe('utils', () => {
  describe('test isGlobalObject', () => {
    it.each([
      [global, true],
      [window, true],
      [self, true],
      [globalThis, true],
      [Function('return this')(), true],
      [{}, false],
      [null, false],
      [undefined, false],
      [['a'], false],
      [123, false],
      [true, false],
      [JSON, false],
      [encodeURIComponent, false],
      [new Date(), false],
    ])('isGlobalObject(%j) === %j', (input, expected) => {
      expect(isGlobalObject(input)).toBe(expected)
    })
  })

  describe('searchToJson', () => {
    it.each([
      ['', {}],
      ['&', {}],
      ['?', {}],
      ['a=', {a: ''}],
      [undefined, {}],
      [null, {}],
      [false, {}],
      ['a=1', { a: '1' }],
      ['a=1&b=2', { a: '1', b: '2' }],
      ['a=1&b=2&c=3', { a: '1', b: '2', c: '3' }],
      ['?q=%E4%B8%AD%E6%96%87', { q: '中文' }],
      ['?%E4%B8%AD%E6%96%87=%E4%B8%AD%E6%96%87', { '中文': '中文' }],
      // invalid encoding
      ['?q=%4%B8%AD%E6%96%87', {}],
    ])('searchToJson(%j) === %j', (query, expected) => {
      // @ts-expect-error test case
      expect(searchToJson(query)).toEqual(expected)
    })
  })

  describe('compareVersion', () => {
    it.each([
      ['1.0.0', '1.0.0', 0],
      ['1.0.0', '1.0.1', -1],
      ['1.0.0', '0.0.1', 1],
    ])('compareVersion(%j, %j) === %j', (a, b, expected) => {
      expect(compareVersion(a, b)).toBe(expected)
    })
  })

  it('waitForINP', async () => {
    const now = Date.now()
    await waitForINP()
    expect(Date.now() - now).toBeGreaterThanOrEqual(10)
  })


  it('noop', () => {
    expect(noop).toBeInstanceOf(Function)
    expect(noop()).toBeUndefined()
  })
})

describe('param', () => {
  it('param', async () => {
    expect(param('a')).toBeUndefined()
    expect(param()).toEqual({})
    globalObject.history.pushState({}, '', '/?a=1&b=2&c=3');
    expect(param('a')).toBe('1')
    globalObject.history.pushState({}, '', '/');
  })
})


describe('isDeepEqual', () => {
  describe('should return true for equal primitive values', () => {
    it.each([
      [+0, -0],
      [0, 0],
      [5, 5],
      ['5', '5'],
      [true, true],
      [false, false],
      [null, null],
      [undefined, undefined],
      [NaN, NaN],
      [new Number(5), Number(5)],
      [new String('a5'), 'a5'],
      [new String('a5'), String('a5')],
      [new Boolean(true), true],
      [new Boolean(false), false],
    ])('isDeepEqual(%j, %j) === true', (a, b) => {
      expect(isDeepEqual(a, b)).toBe(true);
    });
  });

  describe('should return false for unequal primitive values', () => {
    it.each([
      [5, 10],
      ['hello', 'world'],
      [true, false],
      [null, undefined],
      [null, {}],
      [undefined, {}],
      [NaN, 0],
      [new Number(5), 53],
      [new String('a5'), 'a'],
      [new Boolean(true), false],
      [new Boolean(false), true],
      [new Boolean(false), 0],
      [new Boolean(true), 1],
      [new Boolean(true), 10],
      [0, '0'],
      [0, ''],
    ])('isDeepEqual(%j, %j) === false', (a, b) => {
      expect(isDeepEqual(a, b)).toBe(false);
    });
  });

  describe('should correctly handle Dates', () => {
    it.each([
      [new Date(2020, 1, 1), new Date(2020, 1, 1), true],
      [new Date(2020, 1, 1), new Date(2020, 1, 2), false],
      [new Date(), new Date(), true],
      [new Date(), /abc/, false],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should correctly handle RegExp', () => {
    it.each([
      [/abc/, /abc/, true],
      [/abc/, /def/, false],
      [/abc/, /abc/i, false],
      [/abc/i, /abc/ig, false],
      [/abc/i, /abc/, false],
      [/abc/i, /def/i, false],
      [/abc/i, new RegExp('abc', 'i'), true],
      [/abc/i, new RegExp('abc'), false],
      [new RegExp('abc', 'ig'), new RegExp('abc', 'ig'), true],
      [new RegExp('abc', 'ig'), new RegExp('abc', 'i'), false],
      [new RegExp('abc', 'ig'), 3, false],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should correctly handle Map and Set', () => {
    it.each([
      [new Map([[1, 2], [3, 4]]), new Map([[1, 2], [3, 4]]), true],
      [new Map([[3, 4], [1, 2]]), new Map([[1, 2], [3, 4]]), true],
      [new Map([[{a: 2}, 2], [{a: 3}, 4]]), new Map([[{a: 3}, 4], [{a: 2}, 2]]), false],
      [new Map([[{a: 2}, 2], [{a: 3}, 4]]), new Map([[1, 2], [3, 4]]), false],
      [new Map([[1, 2], [3, 4]]), new Map([[1, 2]]), false],
      [new Map([[1, 2], [3, 4]]), new Map([[1, 2], [3, 5]]), false],
      [new Map([[1, 2], [3, 4]]), new Map([[1, 2]]), false],
      [new Map([[1, 2], [3, 4]]), new Map([[1, 2], [3, 4], [5, 6]]), false],
      [new Set([1, 2, 3]), new Set([2, 1, 3]), true],
      [new Set([1, 2, 3]), new Set([1, 2, 4]), false],
      [new Set([1, 2, 3]), new Set([1, 4]), false],
      [new Set([1, 2, 3]), new Set([1, 2]), false],
      [new Set([1, 2, 3]), new Set([1, 2, 3, 4]), false],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should return true for deeply equal objects', () => {
    it.each([
      [{ a: 1, b: 2 }, { a: 1, b: 2 }, true],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }, true],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } }, false],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { d: 2 } }, false],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2, d: 3 } }, false],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 }, d: 3 }, false],
      [{ a: 1, b: { c: 2 }, d: 3 }, { a: 1, b: { c: 2 }, d: 3 }, true],
      [{ a: 1, b: { c: 2 }, d: 3 }, { a: 1, b: { c: 2 }, d: 4 }, false],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should return false for deeply unequal arrays', () => {
    it.each([
      [[1, 2, 3], [1, 2, 3], true],
      [[1, 2, 3], [1, 2, 4], false],
      [[1, 2, 3], [1, 2], false],
      [[1, 2, 3], [1, 2, 3, 4], false],
      [[1, 2, 3], [1, 2, '3'], false],
      [[1, 2, 3], [1, 2, 3, '4'], false],
      [[1, 2, 3], [1, 2, 3, 4], false],
      [[1, 2, 3], [1, 2, 3, 4], false],
      [[1, 2, 3], [1, 2, 3, 4], false],
      [[1, 2, 3], [1, 2, 3, 4], false],
      [[1, 2, 3], [1, 2, 3, 4], false],
      [[[1, 2], [3, 4]], [[1, 2], [3, 4]], true],
      [[[1, 2], [3, 4]], [[1, 2], [3, 5]], false],
      [[[1, 2], [3, 4]], [[1, 2], [3]], false],
      [[[1, 2], [3, 4]], [[1, 2], [3, 4], [5, 6]], false],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should return false when comparing functions', () => {
    it.each([
      [() => {}, () => {}, false],
      [() => {}, () => 1, false],
      [() => 1, () => 1, false],
      [() => 1, () => 2, false],
      [() => 2, '() => 2', false],
      [Array.isArray, Array.isArray, true],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should handle edge cases', () => {
    const img = new Image()
    it.each([
      [document.createElement('div'), document.createElement('div'), false],
      [img, img, true],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should correctly handle complex object', () => {
    it.each([
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }, true],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } }, false],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { d: 2 } }, false],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2, d: 3 } }, false],
      [{ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 }, d: 3 }, false],
      [{ a: 1, b: { c: 2 }, d: 3 }, { a: 1, b: { c: 2 }, d: 3 }, true],
      [{ a: 1, b: { c: 2 }, d: 3 }, { a: 1, b: { c: 2 }, d: 4 }, false],
      [{ a: 1, b: { c: 2 }}, {}, false],
      [{a: [12,323], b: false}, {c: 1, d: 'hello'}, false],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });
  });

  describe('should correctly handle Symbols', () => {
    it.each([
      [Symbol('foo'), Symbol('foo'), false],
      [Symbol.for('bar'), Symbol.for('bar'), true],
      [Symbol('foo'), Symbol('bar'), false],
      [Symbol.iterator, Symbol.iterator, true],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should correctly handle BigInt', () => {
    it.each([
      ['bigint1', BigInt(1234567890123456789), BigInt(1234567890123456789), true],
      ['bigint2', BigInt(1234567890123456789), BigInt(9876543210987654321), false],
    ])('%2', (_, a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should correctly handle TypedArrays', () => {
    const buffer = new ArrayBuffer(8);
    it.each([
      [new Int8Array([1, 2, 3]), new Int8Array([1, 2, 3]), true],
      [new Int8Array([1, 2, 3]), new Int8Array([1, 2, 4]), false],
      [new Int8Array([1, 2, 3]), new Int8Array([1, 2]), false],
      [new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]), true],
      [new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]), false],
      [new Float32Array([1.1, 2.2, 3.3]), new Float32Array([1.1, 2.2, 3.3]), true],
      [new Float32Array([1.1, 2.2, 3.3]), new Float32Array([1.1, 2.2, 3.4]), false],
      [new DataView(buffer), new DataView(buffer), true],
      [new DataView(buffer), new DataView(new ArrayBuffer(8)), true],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should correctly handle mixed types', () => {
    it.each([
      [{ a: [1, { b: 2 }], c: 'foo' }, { a: [1, { b: 2 }], c: 'foo' }, true],
      [{ a: [1, { b: 2 }], c: 'foo' }, { a: [1, { b: 3 }], c: 'foo' }, false],
      [{ a: new Set([1, 2]), b: new Map([['key', 'value']]) }, { a: new Set([1, 2]), b: new Map([['key', 'value']]) }, true],
      [{ a: new Set([1, 2]), b: new Map([['key', 'value']]) }, { a: new Set([1, 3]), b: new Map([['key', 'value']]) }, false],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });

  describe('should correctly handle empty and null values', () => {
    it.each([
      [null, null, true],
      [undefined, undefined, true],
      [null, undefined, false],
      [0, null, false],
      ['', null, false],
      [[], null, false],
      [{}, null, false],
      [NaN, NaN, true],
      [NaN, 0, false],
      [NaN, 'NaN', false],
    ])('isDeepEqual(%j, %j) === %j', (a, b, result) => {
      expect(isDeepEqual(a, b)).toBe(result);
    });
  });