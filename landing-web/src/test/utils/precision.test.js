/*
 * Owner: jesse.shao@kupotech.com
 */

import cachePrecision, { all } from 'utils/precision';

test('cachePrecision should return cached precision if precision is not a number', () => {
  const coin = 'BTC';
  const precision = 8;
  cachePrecision(coin, precision);
  expect(cachePrecision(coin)).toEqual(precision);
});

test('cachePrecision should cache the precision and return it if precision is a number', () => {
  const coin = 'ETH';
  const precision = 18;
  expect(cachePrecision(coin, precision)).toEqual(precision);
  expect(cachePrecision(coin)).toEqual(precision);
});

test('all should return all cached precision mappings', () => {
  const coin1 = 'BTC';
  const precision1 = 8;
  const coin2 = 'ETH';
  const precision2 = 18;
  cachePrecision(coin1, precision1);
  cachePrecision(coin2, precision2);
  expect(all()).toEqual({ [coin1]: precision1, [coin2]: precision2 });
});
