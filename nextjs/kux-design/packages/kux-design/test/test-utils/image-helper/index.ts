import fs from 'fs';
const TEST_IMAGE_BASE64 = fs.readFileSync(require.resolve('./assets/logo.base64.txt'), 'utf8');
const TEST_IMAGE_PATH = require.resolve('./assets/logo.png');

// mock 图片加载
function mockImageLoad({ success = true, error = 'error' } = {}) {
  const mockImg = {
    set src(_) {
      setTimeout(() => {
        if (success) {
          this.onload();
        } else {
          this.onerror(error);
        }
      }, 0);
    },
    onload: jest.fn(),
    onerror: jest.fn(),
    crossOrigin: '',
  } as unknown as HTMLImageElement;
  global.Image = jest.fn(() => mockImg) as unknown as typeof Image;
  return mockImg;
}

// mock 创建canvas
function mockCreateCanvas({
  base64 = '',
  context,
}: { base64?: string; context?: Partial<CanvasRenderingContext2D> } = {}) {
  const ctx = context === undefined ? { drawImage: jest.fn() } : context;
  const canvas = {
    width: 0,
    height: 0,
    getContext: jest.fn(() => ctx),
    toDataURL: jest.fn(() => base64),
  } as unknown as HTMLCanvasElement;

  jest.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'canvas') return canvas;
    return document.createElement('div');
  });

  return canvas;
}

export { TEST_IMAGE_BASE64, TEST_IMAGE_PATH, mockImageLoad, mockCreateCanvas };
