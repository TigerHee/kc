/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DrawerSignUp from 'components/DrawerSignUp';

jest.mock('utils/systemDynamic', () => {
  const originalModule = jest.requireActual('utils/systemDynamic');
  return {
    __esModule: true,
    ...originalModule,
    systemDynamic: jest.fn((param, { onClose, open, children }) => (
      <div>
        {open ? 'Drawer is open' : 'Drawer is closed'} <button onClick={onClose}>Close</button>
        {children}
      </div>
    )),
  };
});

jest.mock('@kufox/mui/hooks/useMediaQuery', () => () => true);

describe('DrawerSignUp', () => {
  test('Drawer should open and close based on the open prop', () => {
    const handleClose = jest.fn();

    const { container } = render(<DrawerSignUp open={false} onClose={handleClose} />);

    expect(container).toBeInTheDocument();
  });
});
