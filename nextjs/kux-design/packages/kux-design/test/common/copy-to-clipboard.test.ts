import { copyToClipboard } from '@/common/copy-to-clipboard';

describe('copyToClipboard', () => {
  let clipboardWriteText: jest.Mock;

  beforeEach(() => {
    clipboardWriteText = jest.fn();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: clipboardWriteText },
      writable: true,
      configurable: true,
    });
    document.execCommand = jest.fn();
  });

  afterEach(() => {
    document.querySelectorAll('textarea').forEach((el) => el.remove());
  });

  it('clipboard success', async () => {
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    clipboardWriteText.mockResolvedValueOnce(undefined);
    const result = await copyToClipboard('a');
    expect(clipboardWriteText).toHaveBeenCalledWith('a'); // 调用现代剪贴板 API
    expect(result).toBe(true); // 复制成功
  });

  it('clipboard fallback on error', async () => {
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    clipboardWriteText.mockRejectedValueOnce(new Error('fail'));
    (document.execCommand as jest.Mock).mockReturnValueOnce(true);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await copyToClipboard('b');
    expect(errorSpy).toHaveBeenCalled(); // 记录错误信息
    expect(result).toBe(true); // 降级到 execCommand 成功
    errorSpy.mockRestore();
  });

  it('fallback when navigator.clipboard is missing', async () => {
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    Object.defineProperty(global.navigator, 'clipboard', { value: undefined, configurable: true });
    (document.execCommand as jest.Mock).mockReturnValueOnce(true);
    const result = await copyToClipboard('c');
    expect(result).toBe(true); // 缺少剪贴板 API 时降级成功
  });

  it('fallback when isSecureContext and clipboard are missing', async () => {
    Object.defineProperty(window, 'isSecureContext', { value: false, configurable: true });
    Object.defineProperty(global.navigator, 'clipboard', { value: undefined, configurable: true });
    (document.execCommand as jest.Mock).mockReturnValueOnce(true);
    const result = await copyToClipboard('d');
    expect(result).toBe(true); // 非安全上下文且缺少剪贴板 API 时降级成功
  });

  it('fallback DOM operation', async () => {
    Object.defineProperty(window, 'isSecureContext', { value: false, configurable: true });
    (document.execCommand as jest.Mock).mockReturnValueOnce(true);
    await copyToClipboard('g');
    expect(document.body.querySelector('textarea')).toBeNull(); // DOM 操作后清理临时元素
  });
});
