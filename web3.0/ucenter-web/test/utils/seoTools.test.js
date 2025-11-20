import { canUseLangLink, getCompleteUrl, getUrlWithOutQuery } from 'src/utils/seoTools';

jest.mock('tools/i18n');

test('test getUrlWithOutQuery', () => {
  expect(canUseLangLink()).toBe(true);
});

test('test getUrlWithOutQuery', () => {
  expect(getUrlWithOutQuery()).toBe();
  expect(getUrlWithOutQuery('/home?id=123')).toBe('/home');
  expect(getUrlWithOutQuery('/home/')).toBe('/home');
});

test('test getCompleteUrl', () => {
  expect(getCompleteUrl(true, '/home', true, true)).toEqual({ href: undefined });
});
