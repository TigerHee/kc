/**
 * Owner: Ray.Lee@kupotech.com
 */
import loadScript from 'src/utils/loadScript.js';

describe('loadScript', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should reject if the script fails to load', async () => {
    const src = 'http://example.com/invalid-script.js';

    const originalCreateElement = document.createElement;

    document.createElement = jest.fn((tagName) => {
      const element = originalCreateElement.call(document, tagName);

      if (tagName === 'script') {
        setTimeout(() => {
          element.onerror();
        }, 0);
      }

      return element;
    });

    await expect(loadScript(src)).rejects.toThrow(`Script load error: ${src}`);

    document.createElement = originalCreateElement;
  });

  it('should set script attributes correctly', async () => {
    const src = 'http://example.com/script.js';

    const opts = {
      type: 'module',

      charset: 'utf-8',

      async: false,

      attrs: {
        'data-test': 'test-value',
      },
    };

    await expect(loadScript(src, opts).type).toBeUndefined();
  });

  it('should set script text content if provided', async () => {
    const src = 'http://example.com/script.js';

    const opts = {
      text: 'console.log("Hello, world!");',
    };

    await expect(loadScript(src, opts).text).toBeUndefined();
  });
});
