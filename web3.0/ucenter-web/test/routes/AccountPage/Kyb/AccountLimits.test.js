import AccountLimits from 'src/routes/AccountPage/Kyc/KybHome/AccountLimits';
import { customRender } from 'test/setup';

const getOriginStore = (verifyStatus) => {
  return {
    kyc: {
      kybInfo: {
        verifyStatus,
      },
      kybPrivileges: {
        kybPass: {
          withDrawLimit: '60,000,000',
          p2pLimit: '1',
          fiatLimit: 0,
          leverLimit: 125,
          trading: true,
          earnCoin: true,
          withdrawUnit: 'USDT',
          p2pUnit: 'USD',
        },
        kybNoPass: {
          withDrawLimit: -1,
          p2pLimit: '-1',
          fiatLimit: -1,
          leverLimit: 0,
          trading: false,
          earnCoin: false,
          withdrawUnit: 'USDT',
          p2pUnit: 'USD',
        },
      },
    },
  };
};

describe('kyb AccountLimits', () => {
  it('render', () => {
    customRender(<AccountLimits />, getOriginStore(-1));
    customRender(<AccountLimits />, getOriginStore(1));
  });
});
