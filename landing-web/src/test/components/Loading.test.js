/**
* Owner: melon@kupotech.com
* Create Date: 2025/02/08 11:46:27
*/

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Loading from 'components/Loading';

jest.mock('@kux/icons', () => {
  const originalModule = jest.requireActual('@kux/icons');
  return {
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('@kux/mui', () => {
  const Spin = (props) => {
    const { children } = props || {};
    return (
      <div {...props} >
        {children}
      </div>
    );
  };

  return {
    __esModule: true,
    Spin,
    ThemeProvider: ({ children, ...rest }) => <div {...rest}>{children || null}</div>,
    useTheme: jest.fn(),
  };
});

describe('Loading', () => {
  test('renders the Loading component with the provided props', () => {
    const testProps = {};
    render(<Loading {...testProps} />);

    const spinElement = screen.queryByTestId('loading');
    expect(spinElement).toBeInTheDocument();
  });
});
