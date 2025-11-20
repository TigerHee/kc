/**
 * Owner: willen@kupotech.com
 */

import coinReport from 'utils/coinReport';
import { getTradeUrl, linkToTrade } from 'utils/linkToTrade';

// Mock the coinReport module
jest.mock('utils/coinReport', () => jest.fn());

// Mock window.location.href
delete window.location;
window.location = { href: '' };

describe('linkToTrade', () => {
  test('linkToTrade with symbol', () => {
    // Define the behavior of the mock function
    coinReport.mockImplementation(() => {});

    linkToTrade('BTC');
    expect(window.location.href).toContain('BTC');
  });

  test('linkToTrade without symbol', () => {
    // Define the behavior of the mock function
    coinReport.mockImplementation(() => {});

    linkToTrade();
    expect(window.location.href).not.toContain('BTC');
  });
});

describe('getTradeUrl', () => {
  test('getTradeUrl with symbol', () => {
    // Define the behavior of the mock function
    coinReport.mockImplementation(() => {});

    const url = getTradeUrl('BTC');
    expect(url).toContain('BTC');
  });

  test('getTradeUrl without symbol', () => {
    // Define the behavior of the mock function
    coinReport.mockImplementation(() => {});

    const url = getTradeUrl();
    expect(url).not.toContain('BTC');
  });
});
