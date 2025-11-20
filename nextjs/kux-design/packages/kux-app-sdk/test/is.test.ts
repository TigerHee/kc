import { is } from '../src/is'


describe('is', () => {
  describe('is true', () => {
    it.each([
      ['string(1) is string', '1', 'string'],
      ['number(1) is number', 1, 'number'],
      ['object number(1) is number', new Number(1), 'number'],
      ['true is boolean', true, 'boolean'],
      ['object boolean(true) is boolean', new Boolean(true), 'boolean'],
      ['symbol(1) is symbol', Symbol('1'), 'symbol'],
      ['undefined is undefined', undefined, 'undefined'],
      ['arrow function is function', () => {}, 'function'],
      ['plain object is object', {}, 'object'],
      ['BigInt(1) is bigint', BigInt(1), 'bigint'],
      ['0n is bigint', 0n, 'bigint'],
      ['null is null', null, 'null'],
      ['NaN is nan', NaN, 'nan'],
      ['null is nullable', null, 'nullable'],
      ['undefined is nullable', undefined, 'nullable'],
      ['empty array is array', [], 'array'],
      ['empty array is iterable', [], 'iterable'],
      ['Map is iterable', new Map(), 'iterable'],
      ['Set is iterable', new Set(), 'iterable'],
      ['Uint8Array is iterable', new Uint8Array(new ArrayBuffer(8)), 'iterable'],
      ['plain object is plainObject', {}, 'plainObject'],
      ['Date instance is Date', new Date(), 'Date'],
    ])('%s', (_, value, type) => {
      // @ts-ignore
      expect(is(value, type)).toBe(true)
    })
  })
  describe('is false', () => {
    it.each([
      ['string(1) is not number', '1', 'number'],
      ['number(1) is not string', 1, 'string'],
      ['true is not number', true, 'number'],
      ['symbol(1) is not string', Symbol('1'), 'string'],
      ['undefined is not object', undefined, 'object'],
      ['arrow function is not object', () => {}, 'object'],
      ['plain object is not function', {}, 'function'],
      ['BigInt(1) is not number', BigInt(1), 'number'],
      ['null is not number', null, 'number'],
      ['NaN is not bigint', NaN, 'bigint'],
      ['null is not undefined', null, 'undefined'],
      ['undefined is not null', undefined, 'null'],
      ['empty array is not string', [], 'string'],
      ['Map is not array', new Map(), 'array'],
      ['Map is not plainObject', new Map(), 'plainObject'],
      ['Set is not array', new Set(), 'array'],
      ['plain object is not array', {}, 'array'],
      ['globalThis is not plainObject', globalThis, 'plainObject'],
      ['Date instance is not string', new Date(), 'string'],
    ])('%s', (_, value, type) => {
      // @ts-ignore
      expect(is(value, type)).toBe(false)
    })
  })

})