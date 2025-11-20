/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from '@kufox/mui/emotion';

import Empty from 'components/common/Empty';

jest.mock('react-router', () => ({
  __esModule: true,
  useHistory: () => ({ push: jest.fn() }),
}));

// 模拟kufox/mui theme
const theme = {
  colors: { text40: '#333333', primary: '#01BC8D', text: '#000D1D' },
  breakpoints: {
    down: () => {},
    up: () => {},
  },
};

describe('Empty', () => {
  test('Empty should in Document', () => {
    const { container } = render(<Empty />);
    expect(container).toBeInTheDocument();
  });
});
