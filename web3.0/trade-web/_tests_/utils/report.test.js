import report from '@kucoin-base/report';

import ReportInstance from 'src/utils/report.js'; // replace with your file path

jest.mock('@kucoin-base/report');

describe('ReportInstance', () => {
  it('calls report function with _RELEASE_', () => {
    expect(report).toHaveBeenCalledWith(_RELEASE_, {"useSm": true});
  });

  it('exports the instance returned by report function', () => {
    expect(ReportInstance).not.toBe(report(_RELEASE_));
  });
});
