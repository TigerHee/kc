import KycWelfare from 'src/components/Account/Kyc3/Home/KycStatusCard/modules/KycWelfare';
import { customRender } from 'test/setup';

describe('test KycWelfare', () => {
  test('test KycWelfare', () => {
    customRender(<KycWelfare />, {
      kyc: {
        rewardInfo: {
          taskType: 'KYC',
          taskSubTitle: 'taskSubTitle',
        },
        kycInfo: {},
      },
    });
    customRender(<KycWelfare />, {
      kyc: {
        rewardInfo: {
          taskType: '',
          taskSubTitle: 'taskSubTitle',
        },
        kycInfo: {},
      },
    });
  });
});
