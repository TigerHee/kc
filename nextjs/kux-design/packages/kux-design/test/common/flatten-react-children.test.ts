import React from 'react';
import { flattenReactChildren } from '@/common/flatten-react-children';

describe('flattenReactChildren', () => {
  it('flattens single-level elements', () => {
    const children = [
      React.createElement('div', { key: '1' }, 'A'),
      React.createElement('span', { key: '2' }, 'B'),
    ];
    const result = flattenReactChildren(children);
    expect(result).toHaveLength(2); // 展平后有两个元素
    expect(result[0].type).toBe('div');
    expect(result[1].type).toBe('span');
  });

  it('flattens Fragment elements', () => {
    const children = React.createElement(
      React.Fragment,
      null,
      React.createElement('div', null, 'A'),
      React.createElement('span', null, 'B'),
    );
    const result = flattenReactChildren(children);
    expect(result).toHaveLength(2); // 展平 Fragment 后有两个元素
    expect(result[0].type).toBe('div');
    expect(result[1].type).toBe('span');
  });

  it('returns empty array for null, undefined, or empty array', () => {
    expect(flattenReactChildren(null)).toEqual([]); // 空值返回空数组
    expect(flattenReactChildren(undefined)).toEqual([]);
    expect(flattenReactChildren([])).toEqual([]);
  });

  it('ignores invalid elements', () => {
    const children = [
      React.createElement('div', { key: '1' }, 'A'),
      null,
      undefined,
      false,
      123,
      'text',
    ];
    const result = flattenReactChildren(children);
    expect(result).toHaveLength(1); // 只保留有效元素
    expect(result[0].type).toBe('div');
  });
});
