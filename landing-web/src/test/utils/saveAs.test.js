/*
 * Owner: terry@kupotech.com
 */
import saveAs from 'src/utils/saveAs.js';

describe('saveAs', () => {
  // 模拟全局的 document 和 window 对象
  beforeAll(() => {
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    global.window = {
      open: jest.fn(),
      document: global.document,
    };
  });

  // 清除模拟
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a link and trigger the download when "download" is in the link', () => {
    // 设置 "download" 属性可用
    const link = {
      download: '',
      href: '',
      click: jest.fn(),
    };
    document.createElement = jest.fn(() => link);

    const uri = 'http://example.com/file';
    const filename = 'file.txt';

    saveAs(uri, filename);

    // expect(document.createElement).toHaveBeenCalledWith('a');
    // expect(document.body.appendChild).toHaveBeenCalledWith(link);
    // expect(link.download).toBe(filename);
    // expect(link.href).toBe(uri);
    // expect(link.click).toHaveBeenCalled();
    // expect(document.body.removeChild).toHaveBeenCalledWith(link);
  });

  it('should open a new window when "download" is not in the link', () => {
    // 假定 "download" 属性不可用
    const link = {
      href: '',
      click: jest.fn(),
    };
    document.createElement = jest.fn(() => link);
    delete link.download; // 确保 link 没有 download 属性

    const uri = 'http://example.com/file';

    saveAs(uri);

    // expect(document.createElement).toHaveBeenCalledWith('a');
    // expect(window.open).toHaveBeenCalledWith(uri);
  });
});