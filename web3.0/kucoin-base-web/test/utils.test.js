import isFunction from 'utils/isFunction';
import { setProject, getProject } from 'utils/project';
import { isEarnPathValid, isFuturesPathValid, isBotTradePathValid, isTradePathValid } from 'utils/validatePath';

describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function() {})).toBe(true);
    expect(isFunction(async function() {})).toBe(true);
    expect(isFunction(function* () {})).toBe(true);
  });

  it('should return false for non-functions', () => {
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(123)).toBe(false);
    expect(isFunction('string')).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});

describe('test project', () => {
  it('should get empty string', () => {
    expect(getProject()).toBe('');
  });

  it('should get brisk-web', () => {
    setProject('brisk-web');
    expect(getProject()).toBe('brisk-web');
    setProject('');
  });
});

describe('test env', () => {
  let originalProcessEnv;
  const originalWindowLocation = window.location;

  beforeEach(() => {
    originalProcessEnv = process.env;
    process.env = { ...originalProcessEnv };
  });

  afterEach(() => {
    process.env = originalProcessEnv;
  });

  it('should return false for IS_PROD when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    const { _DEV_, IS_PROD } = require('utils/env');
    expect(_DEV_).toBe(true);
    expect(IS_PROD).toBe(false);
  });

  it('should return true for IS_PROD when NODE_ENV is production and host does not include .net', () => {
    process.env.NODE_ENV = 'production';
    delete window.location;
    window.location = { ...originalWindowLocation, host: 'kucoin.com' };
    jest.resetModules();
    const { _DEV_, IS_TEST_ENV, IS_PROD } = require('utils/env');
    expect(_DEV_).toBe(false);
    expect(IS_TEST_ENV).toBe(false);
    expect(IS_PROD).toBe(true);
    window.location = originalWindowLocation;
  });

  it('should return false for IS_PROD_ENV when NODE_ENV is production but host includes .net', () => {
    process.env.NODE_ENV = 'production';
    delete window.location;
    window.location = { ...originalWindowLocation, host: 'kucoin.net' };
    jest.resetModules();
    const { _DEV_, IS_TEST_ENV, IS_PROD } = require('utils/env');
    expect(_DEV_).toBe(false);
    expect(IS_TEST_ENV).toBe(true);
    expect(IS_PROD).toBe(false);
    window.location = originalWindowLocation;
  });
});

describe('test validPath', () => {
  it('should get false when no path', () => {
    expect(isEarnPathValid()).toBe(false);
    expect(isFuturesPathValid()).toBe(false);
    expect(isBotTradePathValid()).toBe(false);
    expect(isTradePathValid()).toBe(false);
  });

  it('should get true when pathname ends with /earn or starts with /earn/', () => {
    expect(isEarnPathValid('/earn')).toBe(true);
    expect(isEarnPathValid('/earn/')).toBe(true);
    expect(isEarnPathValid('/earn/more')).toBe(true);
    expect(isEarnPathValid('/earnmore')).toBe(false);
    expect(isEarnPathValid('/a/earn/more')).toBe(false);
  });

  it('should get true when pathname ends with /futures or starts with /futures/ but not includes /futures/lite /futures/h5', () => {
    expect(isFuturesPathValid('/futures')).toBe(true);
    expect(isFuturesPathValid('/futures/')).toBe(true);
    expect(isFuturesPathValid('/futures/page')).toBe(true);
    expect(isFuturesPathValid('/futurespage')).toBe(false);
    expect(isFuturesPathValid('/a/futures/page')).toBe(false);
    expect(isFuturesPathValid('/a/futures/lite')).toBe(false);
    expect(isFuturesPathValid('/a/futures/h5')).toBe(false);
  });

  it('should get true when pathname ends with /trade or starts with /trade/', () => {
    expect(isTradePathValid('/trade')).toBe(true);
    expect(isTradePathValid('/trade/')).toBe(true);
    expect(isTradePathValid('/trade/page')).toBe(true);
    expect(isTradePathValid('/tradepage')).toBe(false);
    expect(isTradePathValid('/a/trade/page')).toBe(false);
  });

  it('should get true when pathname ends with /trading-bot or starts with /trading-bot/', () => {
    expect(isBotTradePathValid('/trading-bot')).toBe(true);
    expect(isBotTradePathValid('/trading-bot/')).toBe(true);
    expect(isBotTradePathValid('/trading-bot/page')).toBe(true);
    expect(isBotTradePathValid('/trading-botpage')).toBe(false);
    expect(isBotTradePathValid('/a/trading-bot/page')).toBe(false);
  });
});
