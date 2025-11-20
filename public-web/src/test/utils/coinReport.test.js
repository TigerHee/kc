/**
 * Owner: jessie@kupotech.com
 */
import Report from 'tools/ext/kc-report';
import coinReport from 'utils/coinReport';

jest.mock('tools/ext/kc-report', () => ({
  logSelfDefined: jest.fn(),
}));

describe('coinReport', () => {
  let dateNowSpy;

  beforeAll(() => {
    // Mock the Date.now() function
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1632444480000); // Mocked timestamp
  });

  afterAll(() => {
    // Restore the original Date.now() function
    dateNowSpy.mockRestore();
  });

  it('should call Report.logSelfDefined with correct parameters', () => {
    coinReport('BTC');
    coinReport('KCS');
    expect(Report.logSelfDefined).toHaveBeenCalledWith('coin_category', {
      symbol: 'KCS',
      duration: 0,
    });

    // Move the mocked Date.now() forward by 1000ms
    dateNowSpy.mockImplementation(() => 1632444481000);

    coinReport('ETH');
    expect(Report.logSelfDefined).toHaveBeenCalledWith('coin_category', {
      symbol: 'ETH',
      duration: 1000,
    });
  });
});
