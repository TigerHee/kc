/**
 * Owner: terry@kupotech.com
 */
import { changeLangPath } from 'src/utils/seoTools.js';
import * as langTools from 'utils/langTools';

// Mock langTools module functions
jest.mock('utils/langTools', () => ({
  getLocalBase: jest.fn(() => ({ localeBasenameFromPath: 'cn' })),
  getPathByLang: jest.fn((lang) => lang),
}));

describe('changeLangPath', () => {
  // Set up window.location mock
  const originalLocation = window.location;
  delete window.location;

  beforeEach(() => {
    window.location = {
      ...originalLocation,
      origin: 'https://www.example.com',
      pathname: '/cn/about',
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it('should change language path to specified language', () => {
    langTools.getPathByLang.mockImplementationOnce((lang) => lang === 'en' ? '' : lang);
    const newUrl = changeLangPath('en');
    expect(newUrl).toBeDefined();
  });

  it('should keep current path when changing to the same language', () => {
    const newUrl = changeLangPath('cn');
    expect(newUrl).toBeDefined();
  });

  // Add more tests to cover different scenarios and edge cases
});