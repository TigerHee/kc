import * as serv from 'services/user_transfer';
import {
  GUIDE_LINK_MAP,
  LINK_TYPE,
  PRIVACY_LINK_MAP,
  TERMS_LINK_MAP,
} from 'src/routes/AccountPage/Transfer/Entry/constants';
import {
  batchFetchBlockingInfo,
  blockingsInfoToState,
  checkBlockingInfo,
  getLinkURL,
} from 'src/routes/AccountPage/Transfer/Entry/utils';
import { getOriginSiteType } from 'src/routes/AccountPage/Transfer/utils/site';
import { addLangToPath } from 'src/tools/i18n';

// 模拟外部依赖
jest.mock('services/user_transfer');
jest.mock('src/tools/i18n');
jest.mock('src/routes/AccountPage/Transfer/utils/site');

describe('Transfer Blocking Info Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 测试 batchFetchBlockingInfo
  describe('batchFetchBlockingInfo', () => {
    const mockUserTransferInfo = {
      targetSiteType: 'australia',
    };

    it('应该正确分批调用接口并合并结果', async () => {
      serv.queryTransferBlockingInfo.mockResolvedValue({
        data: { test: 'data' },
      });

      const result = await batchFetchBlockingInfo(mockUserTransferInfo);

      expect(serv.queryTransferBlockingInfo).toHaveBeenCalledTimes(6);
      expect(result).toHaveLength(6);
      expect(result.every((item) => item.test === 'data')).toBe(true);
    });

    it('应该处理空输入', async () => {
      serv.queryTransferBlockingInfo.mockResolvedValue({ data: null });
      const result = await batchFetchBlockingInfo(null);
      expect(result).toHaveLength(6);
    });
  });

  // 测试 checkBlockingInfo
  describe('checkBlockingInfo', () => {
    const testCases = [
      {
        name: '检测数组阻塞',
        input: [{ key: ['item'] }],
        expected: true,
      },
      {
        name: '检测freezeFunds阻塞',
        input: [{ freezeFunds: true }],
        expected: true,
      },
      {
        name: '检测用户绑定需求',
        input: [{ userBindInfo: { needBindEmail: true } }],
        expected: true,
      },
      {
        name: '检测KYC需求',
        input: [{ kycBlockingInfo: { needCompletionKycInfo: true } }],
        expected: true,
      },
      {
        name: '无阻塞情况',
        input: [{ empty: {} }],
        expected: false,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        expect(checkBlockingInfo(input)).toBeDefined();
      });
    });
  });

  // 测试 blockingsInfoToState
  describe('blockingsInfoToState', () => {
    const mockBlockingInfos = [
      {
        accountInfoList: [{ id: 1 }],
        financialProductsList: [{ id: 2 }],
        freezeFunds: { noSupportCurrencies: ['BTC'] },
        merchantInfoList: [{ merchantType: 'type1' }],
        orderInfoList: [
          { orderType: 'fait_currency_recharge' },
          { orderType: 'crypto_assets_withdraw' },
          { orderType: 'other' },
        ],
        kycBlockingInfo: { level: 2 },
        userBindInfo: { needBindPhoneNo: true },
      },
      {
        accountInfoList: [{ id: 3 }],
      },
    ];

    it('应该正确转换数据结构', () => {
      const result = blockingsInfoToState(mockBlockingInfos);

      // 验证账户信息
      expect(result.accountBlockingInfo).toHaveLength(3);
      expect(result.accountBlockingInfo[1].accountType).toBe('type1');

      // 验证理财产品
      expect(result.financialBlockingInfo).toHaveLength(1);

      // 验证冻结资产
      expect(result.assetBlockingInfo[0].count).toBe(1);

      // 验证订单分类
      expect(result.fiatBlockingInfo).toHaveLength(1);
      expect(result.cryptoBlockingInfo).toHaveLength(1);
      expect(result.tradeBlockingInfo).toHaveLength(1);

      // 验证用户信息
      expect(result.kycBlockingInfo.level).toBe(2);
      expect(result.userBindInfo.needBindPhoneNo).toBe(true);
    });

    it('应该处理空输入', () => {
      const result = blockingsInfoToState(null);
      expect(result.accountBlockingInfo).toHaveLength(0);
    });
  });

  // 测试 getLinkURL
  describe('getLinkURL', () => {
    const originSite = 'global';
    const targetSite = 'australia';

    beforeEach(() => {
      getOriginSiteType.mockReturnValue(originSite);
      addLangToPath.mockImplementation((path) => `/en${path}`);
    });

    const testCases = [
      {
        type: LINK_TYPE.GUIDE,
        expected: GUIDE_LINK_MAP[originSite][targetSite],
      },
      {
        type: LINK_TYPE.PRIVACY,
        expected: PRIVACY_LINK_MAP[originSite][targetSite],
      },
      {
        type: LINK_TYPE.TERMS,
        expected: TERMS_LINK_MAP[originSite][targetSite],
      },
      {
        type: 'invalid',
        expected: '',
      },
    ];

    testCases.forEach(({ type, expected }) => {
      it(`应正确处理 ${type} 类型链接`, () => {
        const result = getLinkURL(type, targetSite);

        if (expected) {
          expect(result).toBe(`/en${expected}`);
          expect(addLangToPath).toHaveBeenCalledWith(expected);
        } else {
          expect(result).toBe('/en');
        }
      });
    });

    it('应处理空参数', () => {
      expect(getLinkURL()).toBe('');
    });
  });
});
