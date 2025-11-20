/**
 * Owner: eli.xiang@kupotech.com
 */

import preloadImage from 'src/utils/preloadImage';

describe('preloadImage', () => {
  let createElementSpy;
  let appendChildSpy;
  let removeSpy;

  beforeEach(() => {
    // Mock document.createElement
    createElementSpy = jest.spyOn(document, 'createElement');

    // Mock document.head.appendChild
    appendChildSpy = jest.spyOn(document.head, 'appendChild');

    // Create a mock link element
    const mockLinkElement = {
      remove: jest.fn(),
      setAttribute: jest.fn(),
    };

    // Make createElement return the mock link element
    createElementSpy.mockImplementation(() => mockLinkElement);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not preload images for unknown path', () => {
    preloadImage('/unknown/path');

    expect(createElementSpy).toHaveBeenCalledTimes(0);
    expect(appendChildSpy).toHaveBeenCalledTimes(0);
  });
});
