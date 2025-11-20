/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { createRender } from '../../../test/test-utils';
import Breadcrumb from './index';

describe('Button', () => {
  const { render } = createRender();

  it('should render children', () => {
    const { getByTestId } = render(
      <Breadcrumb data-testid="breadcrumb">
        <Breadcrumb.Item data-testid="bread_0">Vaex Help Center1</Breadcrumb.Item>
        <Breadcrumb.Item data-testid="bread_1">Vaex Help Center2</Breadcrumb.Item>
        <Breadcrumb.Item data-testid="bread_2">Vaex Help Center3</Breadcrumb.Item>
      </Breadcrumb>,
    );
    const element = getByTestId('breadcrumb');
    expect(element.children.length).toBe(3);

    const bread_0 = getByTestId('bread_0');
    const bread_1 = getByTestId('bread_1');
    const bread_2 = getByTestId('bread_2');
    expect(bread_0.childNodes[0].textContent).toBe('Vaex Help Center1');
    expect(bread_1.childNodes[0].textContent).toBe('Vaex Help Center2');
    expect(bread_2.childNodes[0].textContent).toBe('Vaex Help Center3');

    expect(bread_0.childNodes[1].nodeName).toBe('svg');
    expect(bread_1.childNodes[1].nodeName).toBe('svg');
    expect(bread_2.childNodes[1].nodeName).toBe('svg');

    expect(bread_0.childNodes[1].classList.contains('rightArrow')).toBe(true);
    expect(bread_1.childNodes[1].classList.contains('rightArrow')).toBe(true);
    expect(bread_2.childNodes[1].classList.contains('rightArrow')).toBe(true);
  });
});
