/**
 * Owner: eli.xiang@kupotech.com
 */

// saveAs.test.js
import saveAs from 'src/utils/saveAs';

describe('saveAs', () => {
  beforeEach(() => {
    // 清除所有的 DOM 元素
    document.body.innerHTML = '';
  });

  test('should open a new window if download is not supported', () => {
    const uri = 'data:text/plain;charset=utf-8,Hello%20World!';
    const filename = 'hello.txt';

    // Mock the link element and its download property
    const linkSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      download: undefined,
      href: '',
      click: jest.fn(),
    });

    const openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());

    saveAs(uri, filename);

    expect(openSpy).toHaveBeenCalledWith(uri);

    // Clean up
    openSpy.mockRestore();
  });
});
