import React from 'react';

import { screen, fireEvent, cleanup } from '@testing-library/react';

import { renderWithTheme } from '_tests_/test-setup';

import TooltipWrapper from 'src/trade4.0/components/TooltipWrapper.js'; // 请确保这是正确的路径
import { useResponsive, useMediaQuery } from '@kux/mui';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
}));
// 为了测试主题样式，我们需要一个模拟的主题

afterEach(cleanup);

describe('TooltipWrapper', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders without crashing', () => {
    useMediaQuery.mockReturnValue(() => false);
    useResponsive.mockReturnValue({ sm: true });
    renderWithTheme(<TooltipWrapper>Test</TooltipWrapper>);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click event', () => {
    useMediaQuery.mockReturnValue(() => false);
    useResponsive.mockReturnValue({ sm: true });
    const handleClick = jest.fn();


    renderWithTheme(<TooltipWrapper onChildClick={handleClick}>Test</TooltipWrapper>);

    fireEvent.click(screen.getByText('Test'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies underline style when useUnderline is true', () => {
    useMediaQuery.mockReturnValue(() => false);
    useResponsive.mockReturnValue({ sm: true });
    renderWithTheme(<TooltipWrapper useUnderline>Test</TooltipWrapper>);
    expect(screen.getByText('Test')).toHaveStyle(`

      font-size: 14px;

      font-weight: 400;

      line-height: 130%;

      color: rgba(29, 29, 29, 0.6);

      border-bottom: 1px dashed rgba(29, 29, 29, 0.4);

      cursor: help;

    `);
  });
});
