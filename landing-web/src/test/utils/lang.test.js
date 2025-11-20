/*
 * Owner: jesse.shao@kupotech.com
 */
import { needConfirmLang, addLangToPath, setLang, _t, _tHTML } from 'utils/lang';
// import { getLocalBase } from './file-to-mock';
import { searchToJson } from 'helper';
import urlparser from 'urlparser';
import storage from 'utils/storage';
import { clear, mockUserAgent } from 'jest-useragent-mock';
import { LANG_DOMAIN, getLocalBase } from 'config';
import e from 'express';


jest.mock('config', () => ({
  ...jest.requireActual('config'),
  getLocalBase: jest.fn(() => {
    return {
      localeBasenameFromPath: 'en',
    };
  }),
}));

describe('needConfirmLang', () => {
  afterEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.removeItem('appConfirmLang');
  });

  it('should return true when not in KuCoin app', () => {
    const mockAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
    mockUserAgent(mockAgent);
    const result = needConfirmLang();
    expect(result).toBe(true);
  });

  it('should return false when in KuCoin app and langByPath is truthy', () => {
    const mockAgent = 'KuCoin';
    mockUserAgent(mockAgent);
    const result = needConfirmLang();
    expect(result).toBe(true);
  });
});

describe('_t', () => {
  it('_t vals', () => {
    expect(_t('test001')).toBe('test001');
  });
});

describe('_tHTML', () => {
  it('_tHTML vals', () => {
    expect(_t('<span>test001</span>')).toBe('<span>test001</span>');
  });
});

describe('addLangToPath', () => {
  test('should return the same URL if it is empty', () => {
    const url = '';
    const result = addLangToPath(url);
    expect(result).toBe(url);
  });

  test('should return the same URL if it starts with http and is not in the langDomain', () => {
    const url = 'http://example.com';
    const result = addLangToPath(url);
    expect(result).toBe(url);
  });

  it('should return empty string if url is empty', () => {
    const result = addLangToPath('');
    expect(result).toEqual('');
  });

  it('should return url if url does not start with http or /', () => {
    const result = addLangToPath('www.example.com');
    expect(result).toEqual('www.example.com');
  });

  it('should return url if url is an external link', () => {
    const result = addLangToPath('http://www.example.com');
    expect(result).toEqual('http://www.example.com');
  });

  it('should add localeBasename to path if url is a language subpath project', () => {
    const result = addLangToPath('https://www.example.com/en/about');
    expect(result).toEqual('https://www.example.com/en/about');
  });

  it('should return url if url is not a language subpath project', () => {
    const result = addLangToPath('https://www.example.com/about');
    expect(result).toEqual('https://www.example.com/about');
  });
});
