/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-26 23:55:38
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-12-27 13:00:00
 * @FilePath: /trade-web/_tests_/components/SvgComponent.test.js
 * @Description:
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
//import { renderHook, act } from '@testing-library/react-hooks';
import SvgComponent from '@/components/SvgComponent/index.js';
import __RewireAPI__, { useDynamicSVGImport } from '@/components/SvgComponent/index.js';

const useOrigin = useDynamicSVGImport;

test('SvgComponent renders without crashing', async () => {
  const mockDynamicSVGImport = jest.fn().mockImplementation(() => ({
    error: null,
    loading: false,
    SvgIcon: () => <svg data-testid="svg-component"></svg>,
  }));
  __RewireAPI__.__Rewire__('useDynamicSVGImport', mockDynamicSVGImport);
  render(<SvgComponent />);
  expect(screen.getByTestId('svg-component')).toBeInTheDocument();
});

test('SvgComponent shows loading state', async () => {
  __RewireAPI__.__Rewire__('useDynamicSVGImport', useOrigin);
  const mockFn = jest.fn();
  const { container } = render(<SvgComponent onCompleted={mockFn} />);
  const div = container.firstChild;
  expect(div).toBeInTheDocument();
  expect(div).toHaveStyle({
    width: '16px',
    height: '16px',
    display: 'inline-flex',
    boxSizing: 'content-box',
  });
});

test('SvgComponent handles error state', async () => {
  const mockDynamicSVGImport = jest.fn().mockImplementation(() => ({
    error: true,
    loading: false,
    SvgIcon: () => <svg data-testid="svg-component"></svg>,
  }));
  __RewireAPI__.__Rewire__('useDynamicSVGImport', mockDynamicSVGImport);
  const mockFn = jest.fn();
  render(<SvgComponent onError={mockFn} />);

  // Test for error state, e.g., showing an error message
  expect(screen.getByText('load error')).toBeInTheDocument();
});
