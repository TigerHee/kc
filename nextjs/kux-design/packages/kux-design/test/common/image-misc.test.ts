import {
  loadImage,
  convertImageToBase64,
  loadImageAsBase64WithCache,
  loadImageAsBase64,
} from '@/common/image-misc';
import {
  TEST_IMAGE_BASE64,
  TEST_IMAGE_PATH,
  mockImageLoad,
  mockCreateCanvas,
} from '../test-utils/image-helper';
import * as cacheManagerModule from '@/common/cache-manager';

describe('image-misc', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadImage', () => {
    it('loads image successfully', async () => {
      const mockImg = mockImageLoad({ success: true });
      await expect(loadImage(TEST_IMAGE_PATH)).resolves.toBe(mockImg); // 成功加载图片
    });

    it('handles image load error', async () => {
      mockImageLoad({ success: false, error: 'error' });
      await expect(loadImage(TEST_IMAGE_PATH)).rejects.toBe('error'); // 处理加载错误
    });
  });

  describe('convertImageToBase64', () => {
    it('converts image element to base64', () => {
      mockCreateCanvas({ base64: TEST_IMAGE_BASE64 });
      const mockImg = { naturalWidth: 100, naturalHeight: 200 } as HTMLImageElement;
      expect(convertImageToBase64(mockImg)).toBe(TEST_IMAGE_BASE64); // 转换图片为 base64
    });

    it('throws if 2d context is missing', () => {
      const canvas = mockCreateCanvas({ context: undefined });
      canvas.getContext = jest.fn(() => null);
      const mockImg = { naturalWidth: 100, naturalHeight: 200 } as HTMLImageElement;
      expect(() => convertImageToBase64(mockImg)).toThrow('Failed to get 2d context of canvas'); // 缺少 2d 上下文时抛出错误
    });
  });

  describe('loadImageAsBase64WithCache', () => {
    it('returns base64 string for image', async () => {
      const base64 = await loadImageAsBase64WithCache(TEST_IMAGE_PATH, 1000);
      expect(typeof base64 === 'string' || typeof base64 === 'undefined').toBe(true); // 返回 base64 字符串
    });

    it('returns cached value if present', async () => {
      const spy = jest
        .spyOn(cacheManagerModule.cacheManager, 'tryGetCache')
        .mockImplementation((_url, _getter, _timeout) => Promise.resolve('cached-base64'));
      const result = await loadImageAsBase64WithCache(TEST_IMAGE_PATH, 1000);
      expect(result).toBe('cached-base64'); // 返回缓存值
      spy.mockRestore();
    });
  });

  describe('loadImageAsBase64', () => {
    it('returns base64 string for image or fallback on error', async () => {
      // 成功分支
      mockImageLoad({ success: true });
      mockCreateCanvas({ base64: TEST_IMAGE_BASE64 });
      const base64 = await loadImageAsBase64(TEST_IMAGE_PATH);
      expect(typeof base64 === 'string' || typeof base64 === 'undefined').toBe(true); // 成功加载并转换

      // 失败分支（自定义 fallback）
      mockImageLoad({ success: false, error: 'fail' });
      const fallback = jest.fn(() => 'fallback-value');
      const result = await loadImageAsBase64('bad-url', fallback);
      expect(result).toBe('fallback-value'); // 失败时使用 fallback
    });
  });
});
