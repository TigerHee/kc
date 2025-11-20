/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import Pointer from 'src/components/AboutUs/Pointer';
import { customRender } from 'test/setup';

describe('test AboutUs', () => {
  test('test AboutUs component', () => {
    const { container } = customRender(<Pointer />);
    expect(container.innerHTML).toContain('0');
  });
});
