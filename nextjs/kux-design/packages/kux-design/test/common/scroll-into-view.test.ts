import {
  scrollIntoView,
  getScrollableParent,
  animateScrollXY,
} from '@/common/scroll-into-view';

describe('scroll-into-view', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.requestAnimationFrame = (cb) => {
      cb(0);
      return 1;
    };
  });

  describe('scrollIntoView', () => {
    it('scrolls to the given element', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      element.scrollIntoView = jest.fn();
      scrollIntoView(element);
      expect(element.scrollIntoView).toHaveBeenCalled(); // 滚动到指定元素
      document.body.removeChild(element);
    });

    it('uses custom options', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      element.scrollIntoView = jest.fn();
      const options = { behavior: 'auto' as const, block: 'end' as const };
      scrollIntoView(element, options);
      expect(element.scrollIntoView).toHaveBeenCalledWith(options); // 使用自定义选项
      document.body.removeChild(element);
    });
  });

  describe('getScrollableParent', () => {
    // 参数说明：[描述, scrollHeight, clientHeight, overflow, 是否能找到父元素]
    it.each([
      // 可滚动的父元素
      ['returns parent if scrollable', 200, 100, 'auto', true],
      // 不可滚动的父元素
      ['returns null if no scrollable parent', 100, 100, 'visible', false],
    ])('%s', (_desc, scrollHeight, clientHeight, overflow, shouldFind) => {
      const child = document.createElement('div');
      const parent = document.createElement('div');
      Object.defineProperty(parent, 'scrollHeight', { value: scrollHeight, writable: true });
      Object.defineProperty(parent, 'clientHeight', { value: clientHeight, writable: true });
      parent.style.overflow = overflow as string;
      parent.appendChild(child);
      document.body.appendChild(parent);
      const result = getScrollableParent(child);
      if (shouldFind) {
        expect(result).toBe(parent); // 找到可滚动的父元素
      } else {
        expect(result).toBeNull(); // 没有可滚动的父元素
      }
      document.body.removeChild(parent);
    });
  });

  describe('animateScrollXY', () => {
    // 参数说明：[描述, 选项, 期望X, 期望Y]
    it.each([
      // 立即滚动到指定位置
      ['scrolls both axes immediately', { toX: 100, toY: 200, duration: 0 }, 100, 200],
      // 只滚动 X 轴
      ['scrolls only X', { toX: 100, duration: 0 }, 100, 0],
      // 只滚动 Y 轴
      ['scrolls only Y', { toY: 200, duration: 0 }, 0, 200],
    ])('%s', (_desc, opts, expectedX, expectedY) => {
      const container = document.createElement('div');
      container.scrollLeft = 0;
      container.scrollTop = 0;
      animateScrollXY(container, opts);
      expect(container.scrollLeft).toBe(expectedX);
      expect(container.scrollTop).toBe(expectedY);
    });

    it('animates scroll with duration', () => {
      const container = document.createElement('div');
      container.scrollLeft = 0;
      container.scrollTop = 0;
      const originalRAF = window.requestAnimationFrame;
      let callCount = 0;
      window.requestAnimationFrame = jest.fn((cb) => {
        if (callCount === 0) {
          callCount++;
          cb(0);
        }
        return 1;
      });
      animateScrollXY(container, { toX: 100, toY: 200, duration: 300 });
      expect(window.requestAnimationFrame).toHaveBeenCalled(); // 使用动画帧进行滚动
      window.requestAnimationFrame = originalRAF;
    });
  });
});
