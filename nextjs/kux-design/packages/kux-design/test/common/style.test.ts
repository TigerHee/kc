import { clx, formatStyleUnit } from '@/common/style';

describe('style', () => {

  describe('clx', () => {
    // [desc, args, expected]
    it.each([
      // 合并字符串
      ['merges strings', ['class1', 'class2', 'class3'], 'class1 class2 class3'],
      // 忽略falsy
      ['ignores falsy', ['class1', null, undefined, '', 'class2'], 'class1 class2'],
      // 对象条件
      [
        'object conditions',
        ['base', { active: true, disabled: false, hidden: true }],
        'base active hidden',
      ],
      // 函数条件
      [
        'function conditions',
        ['base', { active: () => true, disabled: () => false }],
        'base active',
      ],
      // 函数返回值
      ['function returns', ['base', () => 'dynamic-class', () => ''], 'base dynamic-class'],
      // 数组
      ['arrays', ['base', ['class1', 'class2'], 'class3'], 'base class1 class2 class3'],
      // 嵌套数组
      ['nested arrays', ['base', [['class1', 'class2'], 'class3']], 'base class1 class2 class3'],
      // 混合
      [
        'mixed',
        ['base', { active: () => true, disabled: false }, ['class1', 'class2'], 'class3'],
        'base active class1 class2 class3',
      ],
      // 数字
      ['numbers', ['base', 123], 'base 123'],
      // 空数组
      ['empty array', ['base', []], 'base'],
    ])('%s', (_desc, args, expected) => {
      expect(clx(...(args as any))).toBe(expected);
    });
  });

  describe('formatStyleUnit', () => {
    // [desc, value, type, expected]
    it.each([
      // 数字默认单位
      ['default units for numbers', 100, undefined, '100px'],
      ['zero', 0, undefined, '0px'],
      ['negative', -10, undefined, '-10px'],
      // 时间类型
      ['time type', 100, 'time', '100ms'],
      ['decimal time', 0.5, 'time', '0.5ms'],
      // 百分比
      ['percentage', 50, 'percent', '50%'],
      ['percentage 100', 100, 'percent', '100%'],
      // 自定义单位
      ['rem', 100, 'rem', '100rem'],
      ['em', 50, 'em', '50em'],
      ['vh', 200, 'vh', '200vh'],
      // 字符串
      ['strings', '100px', undefined, '100px'],
      ['percentage string', '50%', undefined, '50%'],
      ['rem string', '2rem', undefined, '2rem'],
      // 零值
      ['zero values', 0, undefined, '0px'],
      ['zero time', 0, 'time', '0ms'],
      ['zero percentage', 0, 'percent', '0%'],
    ])('%s', (_desc, value, type, expected) => {
      expect(formatStyleUnit(value, type)).toBe(expected);
    });
  });
});
