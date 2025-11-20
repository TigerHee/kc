import React from 'react';
import { render } from '@testing-library/react';
import {
  pick,
  getProp,
  debounce,
  extractTextFromNode,
  delay,
  isRenderable,
  getDocumentDir,
  middleEllipsis,
} from '@/common/utils';

describe('utils', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('pick', () => {
    it.each([
      // 正常选择多个属性
      [{ a: 1, b: 2, c: 3 }, ['a', 'c'], { a: 1, c: 3 }],
      // 选择不存在的属性
      [{ a: 1, b: 2 }, ['a', 'c', 'd'], { a: 1 }],
      // 跳过 undefined 值
      [{ a: 1, b: undefined, c: 3 }, ['a', 'b', 'c'], { a: 1, c: 3 }],
    ])('pick(%j, %j) => %j', (obj, keys, expected) => {
      expect(pick(obj, keys as any)).toEqual(expected);
    });
  });

  describe('getProp', () => {
    it.each([
      // 嵌套对象路径
      [{ a: { b: { c: 123 } } }, 'a.b.c', 123],
      // 数组索引路径
      [{ a: [{ b: 123 }] }, 'a.0.b', 123],
      // 不存在的属性
      [{ a: { b: 123 } }, 'a.b.c', undefined],
      // 深层不存在的属性
      [{ a: { b: 123 } }, 'a.b.c.d', undefined],
    ])('getProp(%j, %s) => %s', (obj, path, expected) => {
      expect(getProp(obj, path)).toBe(expected);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    it('delays function execution', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);
      debounced();
      expect(func).not.toHaveBeenCalled(); // 立即调用时函数未执行
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1); // 延迟后执行
    });
    it('resets timer on repeated calls', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);
      debounced();
      jest.advanceTimersByTime(50);
      debounced(); // 重复调用重置定时器
      jest.advanceTimersByTime(50);
      expect(func).not.toHaveBeenCalled(); // 重置后未到时间
      jest.advanceTimersByTime(50);
      expect(func).toHaveBeenCalledTimes(1); // 最终执行一次
    });
  });

  describe('extractTextFromNode', () => {
    it.each([
      // 字符串和数字转换
      ['hello', 'hello'],
      [123, '123'],
      // 空值处理
      [null, ''],
      [undefined, ''],
    ])('extractTextFromNode(%s) => %s', (input, expected) => {
      expect(extractTextFromNode(input)).toBe(expected);
    });
    it('extracts text from React element', () => {
      const element = <div>hello world</div>;
      const { container } = render(element);
      expect(extractTextFromNode(element)).toBe('hello world');
      expect(container.textContent).toBe('hello world');
    });
  });

  describe('delay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    it('delays for specified time', async () => {
      const promise = delay(100);
      jest.advanceTimersByTime(100);
      await promise;
      await expect(promise).resolves.toBeUndefined(); // 指定延迟时间
    });
    it('uses default delay', async () => {
      const promise = delay();
      jest.advanceTimersByTime(100);
      await promise;
      await expect(promise).resolves.toBeUndefined(); // 使用默认延迟时间
    });
  });

  describe('isRenderable', () => {
    it.each([
      // 可渲染的值
      ['hello', true],
      [123, true],
      [0, true],
      [[], true],
      [{}, true],
      // 不可渲染的值
      [null, false],
      [undefined, false],
      ['', false],
      [true, false],
      [false, false],
    ])('isRenderable(%s) => %s', (input, expected) => {
      expect(isRenderable(input)).toBe(expected);
    });
  });

  describe('getDocumentDir', () => {
    it('returns ltr by default', () => {
      document.documentElement.removeAttribute('dir');
      expect(getDocumentDir()).toBe('ltr'); // 默认返回 ltr
    });
  });

  describe('middleEllipsis', () => {
    it.each([
      // 正常截断情况
      ['abcdefghijklmnop', 10, 'abcd…mnop'],
      // 长度不足，不截断
      ['abc', 10, 'abc'],
      // 空字符串
      ['', 10, ''],
      // 长度过短，只显示省略号
      ['abcdef', 3, '…'],
      // 长度过短，只显示省略号
      ['abcdef', 2, '…'],
      // 中间截断
      ['abcdefgh', 7, 'abc…fgh'],
    ])('middleEllipsis(%s, %d) => %s', (input, maxLen, expected) => {
      expect(middleEllipsis(input, maxLen)).toBe(expected);
    });
  });
});
