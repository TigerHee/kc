import { useForm } from '@kux/mui/Form';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { searchToJson } from 'helper';
import moment from 'moment';
import { getExportQueue, getExportRemainTimes, postExport } from 'services/commonBasis';
import V3ExportDrawer from 'src/components/V3ExportDrawer/index';
import { getExportRemainTimesTH } from 'src/services/download';
import { customRender } from 'test/setup';

jest.mock('@kux/mui/Form', () => ({
  ...jest.requireActual('@kux/mui/Form'),
  useForm: jest.fn(),
}));

jest.mock('helper', () => ({
  searchToJson: jest.fn(),
  showDatetime: jest.fn(),
}));

jest.mock('services/commonBasis', () => ({
  exportAccountStatementBill: jest.fn(),
  getExportQueue: jest.fn(),
  getExportRemainTimes: jest.fn(),
  postExport: jest.fn(),
}));

jest.mock('src/services/download', () => ({
  getExportRemainTimesTH: jest.fn(),
}));

describe('test V3ExportDrawer', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 清除所有的 mocks
    let mockForm;
    getExportRemainTimes.mockResolvedValue({ success: true, data: 3 });
    getExportRemainTimesTH.mockResolvedValue({ success: true, data: 3 });
    getExportQueue.mockResolvedValue({ data: 366 });
    postExport.mockResolvedValue({ success: true });
    mockForm = {
      setFieldsValue: jest.fn(),
      validateFields: jest.fn().mockResolvedValue({
        codes: ['INOUT-RECHARGE'],
        times: [new Date(), new Date()],
        subAccount: true,
        fileType: 'csv',
      }),
    };
    useForm.mockReturnValue([mockForm]);
  });
  test('test V3ExportDrawer TH', () => {
    window._BRAND_SITE_ = 'TH';
    const { getByTestId } = customRender(<V3ExportDrawer isInDrawer={false} />, {
      user: {
        user: {
          timeZone: '',
        },
        timeZonesV2: [],
      },
      download: {
        records: [],
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      effects: {
        'user/pullUser': false,
      },
      order_meta: {
        exportDrawerOpen: true,
        subUserList: [],
      },
    });
    waitFor(() => {
      const button = getByTestId('export-drawer-submit-th');
      fireEvent.click(button);
    });
  });

  test('test V3ExportDrawer TH with open drawer', () => {
    window._BRAND_SITE_ = 'TH';
    searchToJson.mockReturnValue({
      openexport: '1',
      fileType: 'csv',
      subAccount: '1',
      times: '2023/10/01,2023/10/10',
      codes: 'code1,code2',
    });
    const { getByTestId } = customRender(<V3ExportDrawer isInDrawer={true} />, {
      download: {
        records: [
          {
            id: '6707a4c21d3daf00012d8276',
            userId: '66962d6d9c45d400010ee153',
            categoryCodes: ['INOUT-RECHARGE', 'INOUT-WITHDRAW'],
            status: 2,
            fileUrl: null,
            createdAt: 1728554178000,
            begin: 1696780800000,
            end: 1728489600000,
            currency: null,
            message: null,
          },
          {
            id: '6707a4911d3daf00012d8275',
            userId: '66962d6d9c45d400010ee153',
            categoryCodes: ['TRADE-ENTRUST', 'TRADE-TRANS'],
            status: 1,
            fileUrl: null,
            createdAt: 1728554129000,
            begin: 1725811200000,
            end: 1728489600000,
            currency: null,
            message: null,
          },
        ],
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      user: {
        timeZone: '1',
      },
      timeZonesV2: ['1', '2'],
      loading: {
        effects: {
          'user/pullUser': false,
        },
      },
      order_meta: {
        exportDrawerOpen: true,
        subUserList: [],
      },
    });

    const mockMomentList = [
      moment().subtract(7, 'days').startOf('days'),
      moment().subtract(1, 'day').endOf('days'),
    ];

    waitFor(() => {
      const button = getByTestId('export-drawer-submit-th');
      userEvent.click(button);
    });
  });

  test('test V3ExportDrawer KC', () => {
    window._BRAND_SITE_ = 'KC';
    customRender(<V3ExportDrawer isInDrawer={true} showRecord={false} />, {
      download: {
        records: [],
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      user: { user: {}, timeZonesV2: [] },
      effects: {
        'user/pullUser': false,
      },
      order_meta: {
        exportDrawerOpen: false,
        subUserList: [],
      },
    });
  });

  test('test V3ExportDrawer KC with open drawer', () => {
    window._BRAND_SITE_ = 'KC';
    searchToJson.mockReturnValue({
      openexport: '1',
      fileType: 'csv',
      subAccount: '1',
      times: '2023/10/01,2023/10/10',
      codes: 'code1,code2',
    });
    const { getByTestId } = customRender(<V3ExportDrawer isInDrawer={true} showRecord={true} />, {
      download: {
        records: [
          {
            id: '6707a4c21d3daf00012d8276',
            userId: '66962d6d9c45d400010ee153',
            categoryCodes: ['INOUT-RECHARGE', 'INOUT-WITHDRAW'],
            status: 2,
            fileUrl: null,
            createdAt: 1728554178000,
            begin: 1696780800000,
            end: 1728489600000,
            currency: null,
            message: null,
          },
          {
            id: '6707a4911d3daf00012d8275',
            userId: '66962d6d9c45d400010ee153',
            categoryCodes: ['TRADE-ENTRUST', 'TRADE-TRANS'],
            status: 1,
            fileUrl: null,
            createdAt: 1728554129000,
            begin: 1725811200000,
            end: 1728489600000,
            currency: null,
            message: null,
          },
        ],
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      user: {
        timeZone: '1',
      },
      timeZonesV2: ['1', '2'],
      loading: {
        effects: {
          'user/pullUser': false,
        },
      },
      order_meta: {
        exportDrawerOpen: true,
        subUserList: [],
      },
    });

    waitFor(() => {
      const button = getByTestId('export-drawer-submit');
      fireEvent.click(button);
    });
  });
});
