import { getMaskRoot, ROOT_MASK_ID } from '@/common/element';

describe('element', () => {
  afterEach(() => {
    const existingRoot = document.getElementById(ROOT_MASK_ID);
    if (existingRoot) {
      existingRoot.remove();
    }
    jest.clearAllMocks();
  });

  it('creates a new mask root node', () => {
    const root = getMaskRoot();
    expect(root).toBeInstanceOf(HTMLElement);
    expect(document.body.contains(root)).toBe(true); // 添加到文档中
  });

  it('returns the existing mask root node', () => {
    const root1 = getMaskRoot();
    const root2 = getMaskRoot();
    expect(root1).toBe(root2); // 返回相同的根节点实例
    expect(document.querySelectorAll('#kux-mask-root')).toHaveLength(1); // 只有一个根节点
  });
});
