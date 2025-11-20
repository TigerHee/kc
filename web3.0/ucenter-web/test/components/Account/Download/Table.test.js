/**
 * Owner: willen@kupotech.com
 */
import Table, { getFailedMsg } from 'src/components/Account/Download/Table';
import { customRender } from 'test/setup';

const data = [
  {
    id: '3',
    userId: '601378f3bd074e0006b90afd',
    categoryCodes: ['TRADE-ENTRUST'],
    status: 0,
    fileUrl: null,
    createdAt: 1678179308000,
    begin: 1646582400000,
    end: 1678204800000,
    currency: null,
  },
  {
    id: '6406fbec61921f0001baf335',
    userId: '601378f3bd074e0006b90afd',
    categoryCodes: [
      'TRADE-ENTRUST',
      'TRADE-TRANS',
      'LEVER-ENTRUST-ALL',
      'LEVER-ENTRUST-GRADUALLY',
      'LEVER-TRANS-ALL',
      'LEVER-TRANS-GRADUALLY',
      'KUMEX-TRANS',
    ],
    status: 1,
    fileUrl: null,
    createdAt: 1678179308000,
    begin: 1646582400000,
    end: 1678204800000,
    currency: null,
  },
  {
    id: '2',
    userId: '601378f3bd074e0006b90afd',
    categoryCodes: ['TRADE-ENTRUST'],
    status: 2,
    fileUrl: null,
    createdAt: 1678179308000,
    begin: 1646582400000,
    end: 1678204800000,
    currency: null,
  },
  {
    id: '3',
    userId: '601378f3bd074e0006b90afd',
    categoryCodes: ['TRADE-ENTRUST'],
    status: 3,
    fileUrl: null,
    createdAt: 1678179308000,
    begin: 1646582400000,
    end: 1678204800000,
    currency: null,
    message: 'LOAD_DATA_FAILED',
  },
  {
    id: '3',
    userId: '601378f3bd074e0006b90afd',
    categoryCodes: ['TRADE-ENTRUST'],
    status: 3,
    fileUrl: null,
    createdAt: 1678179308000,
    begin: 1646582400000,
    end: 1678204800000,
    currency: null,
  },
  {
    id: '4',
    userId: '601378f3bd074e0006b90afd',
    categoryCodes: ['TRADE-ENTRUST'],
    status: 4,
    fileUrl: 'xxx.jpg',
    createdAt: 1678179308000,
    begin: null,
    end: null,
    currency: 'BTC',
  },
];

describe('test Table', () => {
  test('test Table component', () => {
    const { container } = customRender(<Table data={data} />);
    expect(container.innerHTML).toContain('generating');
  });
});

describe('getFailedMsg', () => {
  it('returns correct message for code "NO_USER"', () => {
    expect(getFailedMsg('NO_USER')).toContain('bill.export.failed.msg.noData');
  });

  it('returns correct message for code "NO_DATA"', () => {
    expect(getFailedMsg('NO_DATA')).toContain('bill.export.failed.msg.noData');
  });

  it('returns correct message for code "LOAD_DATA_FAILED"', () => {
    expect(getFailedMsg('LOAD_DATA_FAILED')).toContain('bill.export.failed.msg.later');
  });

  it('returns correct message for code "PACK_FILE_FAILED"', () => {
    expect(getFailedMsg('PACK_FILE_FAILED')).toContain('bill.export.failed.msg.later');
  });

  it('returns correct message for code "UPLOAD_FAILED"', () => {
    expect(getFailedMsg('UPLOAD_FAILED')).toContain('bill.export.failed.msg.later');
  });

  it('returns correct message for code "OVERTIME"', () => {
    expect(getFailedMsg('OVERTIME')).toContain('bill.export.failed.msg.later');
  });

  it('returns correct message for code "UNKNOWN"', () => {
    expect(getFailedMsg('UNKNOWN')).toContain('bill.export.failed.msg.later');
  });

  it('returns correct message for code "DEALER"', () => {
    expect(getFailedMsg('DEALER')).toContain('bill.export.failed.msg.notSupport');
  });

  it('returns correct message for code "MORE_SIZE"', () => {
    expect(getFailedMsg('MORE_SIZE')).toContain('bill.export.failed.msg.overSize');
  });

  it('returns correct message for any other code', () => {
    expect(getFailedMsg('INVALID_CODE')).toContain('bill.export.failed.msg.err');
  });
});
