/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-10-24 22:12:14
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-24 22:58:37
 * @FilePath: /trade-web/_tests_/components/trade4.0/mui/Tabs.test.js
 * @Description: 
 */
import React from 'react';

import '@testing-library/jest-dom';

import { fireEvent } from '@testing-library/react';

import { renderWithTheme } from '_tests_/test-setup';

import { Tabs } from 'src/trade4.0/components/mui/Tabs.js'; // 请根据实际路径修改

import { useIsRTL } from '@/hooks/common/useLang';

jest.mock('@/hooks/common/useLang', () => ({
  useIsRTL: jest.fn(),
}));

const mockTheme = {
  colors: {
    text: '#000',

    primary: '#007bff',
  },

  breakpoints: {
    up: jest.fn().mockReturnValue('@media (min-width:600px)'),
  },

  currentTheme: 'light',
};

describe('Tabs Component', () => {
  beforeEach(() => {
    useIsRTL.mockReturnValue(false);
  });

  it('renders Tabs component with default props', () => {
    const { container } = renderWithTheme(<Tabs />, { theme: mockTheme });

    const tabsElement = document.querySelector('.KuxTabs-indicator');

    expect(tabsElement).toBeInTheDocument();

    expect(tabsElement).toHaveStyle('display: flex');
  });

  it('applies xsmall size styles', () => {
    const { container } = renderWithTheme(<Tabs size="xsmall" variant="bordered" />, {
      theme: mockTheme,
    });

    const tabsElement = document.querySelector('.KuxTabs-container');

    expect(tabsElement).toBeInTheDocument();
  });

  it('applies xxsmall size styles', () => {
    const { container } = renderWithTheme(<Tabs size="xxsmall" variant="bordered" />, {
      theme: mockTheme,
    });

    const tabsElement = document.querySelector('.KuxTabs-container');

    expect(tabsElement).toBeInTheDocument();
  });

  it('applies dark theme styles in layer', () => {
    const darkTheme = { ...mockTheme, currentTheme: 'dark' };

    const { container } = renderWithTheme(<Tabs inLayer />, { theme: darkTheme });

    const tabsElement = document.querySelector('.KuxTabs-container');

    expect(tabsElement).toBeInTheDocument();
  });

  it('applies light theme styles in layer', () => {
    const { container } = renderWithTheme(<Tabs inLayer />, { theme: mockTheme });

    const tabsElement = document.querySelector('.KuxTabs-container');

    expect(tabsElement).toBeInTheDocument();
  });

  it('handles RTL direction', () => {
    useIsRTL.mockReturnValue(true);

    const { container } = renderWithTheme(<Tabs />, { theme: mockTheme });

    const tabsElement = document.querySelector('.KuxTabs-indicator');

    expect(tabsElement).toBeInTheDocument();
  });
});
