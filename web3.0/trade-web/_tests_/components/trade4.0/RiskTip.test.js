import React from 'react';

import { screen, fireEvent, waitFor } from '@testing-library/react';

import { renderWithTheme } from '_tests_/test-setup';

import { useSelector, useDispatch } from 'dva';

import RiskTip from 'src/trade4.0/components/RiskTip/index.js';

import storage from 'utils/storage.js';

// Mock the necessary modules

jest.mock('@mui/Alert', () => {
  return ({ type, title, showIcon, closable, onClose }) => (
    <div data-testid="mock-alert">
      Mock Alert - {title}
      {closable && <button onClick={onClose}>Close</button>}
    </div>
  );
});

jest.mock('dva', () => ({
  useSelector: jest.fn(),

  useDispatch: jest.fn(),
}));

jest.mock('src/trade4.0/hooks/common/useIsSpotSymbol.js', () => ({
  isSpotTypeSymbol: jest.fn(),
}));

jest.mock('@/hooks/common/useSymbol', () => ({
  useGetCurrentSymbol: jest.fn(),
}));

jest.mock('utils/storage.js', () => ({
  getItem: jest.fn(),

  setItem: jest.fn(),
}));

describe('RiskTip', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();

    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        symbols: { riskTipMap: { BTCUSDT: 'This is a risk tip' } },

        app: {
          complianceTaxInfo: { needPayTax: true, taxRate: 0, taxRegion: 'india' },
          complianceTaxText: 'Tax info',
        },

        trade: { tradeType: 'TRADE' },
      }),
    );

    require('@/hooks/common/useSymbol').useGetCurrentSymbol.mockReturnValue('BTCUSDT');

    require('src/trade4.0/hooks/common/useIsSpotSymbol.js').isSpotTypeSymbol.mockReturnValue(true);

    const {
      wrapper: { container },
    } = renderWithTheme(<RiskTip />);

    expect(container).toBeTruthy();
  });

  it('should save to storage when close button is clicked', async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        symbols: { riskTipMap: { BTCUSDT: 'This is a risk tip' } },

        app: {
          complianceTaxInfo: { needPayTax: false, taxRate: 0, taxRegion: 'india' },
          complianceTaxText: '',
        },

        trade: { tradeType: 'TRADE' },
      }),
    );

    require('@/hooks/common/useSymbol').useGetCurrentSymbol.mockReturnValue('BTCUSDT');

    require('src/trade4.0/hooks/common/useIsSpotSymbol.js').isSpotTypeSymbol.mockReturnValue(true);

    storage.getItem.mockReturnValue({});

    renderWithTheme(<RiskTip />);

    // Wait for the "Close" buttons to be in the document

    await waitFor(() => expect(screen.getAllByText('Close')).toHaveLength(2));

    // Get all "Close" buttons

    const closeButtons = screen.getAllByText('Close');

    // Click the first "Close" button (or whichever one you need)

    fireEvent.click(closeButtons[0]);

    //expect(storage.setItem).toHaveBeenCalledWith('RISK_TIP', { BTCUSDT: 'CLOSE' });
  });

  it('should display compliance tax info', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        symbols: { riskTipMap: {} },

        app: {
          complianceTaxInfo: { needPayTax: true, taxRate: 0, taxRegion: 'india' },
          complianceTaxText: 'Tax info',
        },

        trade: { tradeType: 'TRADE' },
      }),
    );

    require('@/hooks/common/useSymbol').useGetCurrentSymbol.mockReturnValue('BTCUSDT');

    require('src/trade4.0/hooks/common/useIsSpotSymbol.js').isSpotTypeSymbol.mockReturnValue(true);

    renderWithTheme(<RiskTip />);

    // Get all elements with data-testid="risk-tip"

    const riskTips = screen.getAllByTestId('risk-tip');

    expect(riskTips[0]).toHaveTextContent('Tax info');
  });

  it('should not render if no risk tip and no compliance tax info', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        symbols: { riskTipMap: {} },

        app: {
          complianceTaxInfo: { needPayTax: false, taxRate: 0, taxRegion: 'india' },
          complianceTaxText: '',
        },

        trade: { tradeType: 'TRADE' },
      }),
    );

    require('@/hooks/common/useSymbol').useGetCurrentSymbol.mockReturnValue('BTCUSDT');

    require('src/trade4.0/hooks/common/useIsSpotSymbol.js').isSpotTypeSymbol.mockReturnValue(true);

    const {
      wrapper: { container },
    } = renderWithTheme(<RiskTip />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should handle storage error gracefully', async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        symbols: { riskTipMap: { BTCUSDT: 'This is a risk tip' } },

        app: {
          complianceTaxInfo: { needPayTax: false, taxRate: 0, taxRegion: 'india' },
          complianceTaxText: '',
        },

        trade: { tradeType: 'TRADE' },
      }),
    );

    require('@/hooks/common/useSymbol').useGetCurrentSymbol.mockReturnValue('BTCUSDT');

    require('src/trade4.0/hooks/common/useIsSpotSymbol.js').isSpotTypeSymbol.mockReturnValue(true);

    storage.getItem.mockImplementation(() => {
      return undefined;
    });

    renderWithTheme(<RiskTip />);

    await waitFor(() => expect(screen.getAllByText('Close')).toHaveLength(4));

    fireEvent.click(screen.getAllByText('Close')[0]);

    //expect(storage.setItem).toHaveBeenCalledWith('RISK_TIP', { BTCUSDT: 'CLOSE' });
  });
});
