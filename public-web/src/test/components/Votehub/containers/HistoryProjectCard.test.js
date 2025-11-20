/**
 * Owner: jessie@kupotech.com
 */
import { isApp } from '@knb/native-bridge';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import HistoryProjectCard from 'src/components/Votehub/containers/components/HistoryProjectCard/index.js';
import { customRender } from 'src/test/setup';

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

describe('test HistoryProjectCard', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: (func) => func(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  test('test HistoryProjectCard with no symbol', async () => {
    customRender(
      <HistoryProjectCard
        logoUrl=""
        name="name"
        subName="date"
        activityName="activityName"
        description="description"
      />,
      {},
    );
  });

  test('test HistoryProjectCard with symbol in app', async () => {
    isApp.mockReturnValue(true);
    customRender(
      <HistoryProjectCard
        logoUrl=""
        name="name"
        subName="date"
        activityName="activityName"
        description="description"
        symbol="BTC-USDT"
        hot={!0}
      />,
      {},
    );

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
  });

  test('test HistoryProjectCard with symbol', async () => {
    isApp.mockReturnValue(false);
    customRender(
      <HistoryProjectCard
        logoUrl=""
        name="name"
        subName="date"
        activityName="activityName"
        description="description"
        symbol="BTC-USDT"
      />,
      {},
    );

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
  });
});
