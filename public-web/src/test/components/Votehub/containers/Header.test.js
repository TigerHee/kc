/**
 * Owner: jessie@kupotech.com
 */
import { isApp } from '@knb/native-bridge';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import Header, { doExit } from 'src/components/Votehub/containers/Header.js';
import { customRender } from 'src/test/setup';

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

describe('test Header', () => {
  test('test Header with pc', async () => {
    customRender(<Header>Header</Header>, {});
  });

  test('test Header with h5', async () => {
    isApp.mockReturnValue(true);
    customRender(<Header>Header</Header>, {});
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
  });

  test('test doExit', async () => {
    const result = doExit();
    expect(result).toBe(undefined);
  });
});
