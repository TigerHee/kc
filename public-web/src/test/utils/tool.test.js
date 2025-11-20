/**
 * Owner: larvide.peng@kupotech.com
 */

// import { getLocaleFromLocaleMap } from 'tools/i18n';
import {
  replaceHelpCenterUrl,
  replaceKucoinLink,
  replaceOldOrigin,
  replacezhHans2zhHant,
  resolveArticalLinks,
} from 'utils/tool';

test('replaceHelpCenterUrl', () => {
  expect(replaceHelpCenterUrl()).toBe();
  expect(replaceHelpCenterUrl(`href="https://support.kucoin.plus/hc/en-us/articles/123"`)).toBe(
    'href="undefined/support/123"',
  );
  expect(replaceHelpCenterUrl(`href="https://support.kucoin.plus/hc/zh-hk/sections/123"`)).toBe(
    'href="undefined/support/sections/123"',
  );
});

test('resolveArticalLinks', () => {
  expect(resolveArticalLinks()).toBe();
  expect(resolveArticalLinks('<a href="https://www.kucoin.com">text</a>')).toBe(
    '<a href="http://localhost">text</a>',
  );
  expect(resolveArticalLinks('<a href="https://express.kucoin.com">text</a>')).toBe(
    '<a href="http://localhost">text</a>',
  );

  expect(resolveArticalLinks('<a href="https://www.kucoin.com/zh-hans">text</a>')).toBe(
    '<a href="http://localhost/zh-hans">text</a>',
  );
});

test('replaceOldOrigin', () => {
  expect(replaceOldOrigin()).toBe();
  expect(replaceOldOrigin('<a href="https://www.kucoin.com">text</a>')).toBe(
    '<a href="https://www.kucoin.com">text</a>',
  );
});

test('replacezhHans2zhHant', () => {
  expect(replacezhHans2zhHant()).toBe();
  expect(replacezhHans2zhHant('href="https://www.kucoin.com/zh-hans"')).toBe(
    'href="http://localhost/zh-hant"',
  );
});

test('replaceKucoinLink', () => {
  expect(replaceKucoinLink()).toBe();
  expect(replaceKucoinLink('href="https://www.kucoin.com"')).toBe('href="https://www.kucoin.com"');
});
