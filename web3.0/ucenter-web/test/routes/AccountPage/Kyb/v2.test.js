import { merge } from 'lodash-es';
import KybKC from 'src/routes/AccountPage/Kyc/Kyb/Home/site/KC';
import { customRender } from 'test/setup';


const originStore = {
  kyc: {
    kybInfo: {
      verifyStatus: -1,
    },
    kybPrivileges: {},
    kybCompanyDetail: {
      companyType: '1',
      currentPhase: 1
    }
  },
};

describe('kyb', () => {
  const originRequestIdleCallback = window.requestIdleCallback;
  const originCancelIdleCallback = window.cancelIdleCallback;

  window.requestIdleCallback = jest.fn();
  window.cancelIdleCallback = jest.fn();

  afterAll(() => {
    window.requestIdleCallback = originRequestIdleCallback;
    window.cancelIdleCallback = originCancelIdleCallback;
  });

  describe('unverified', () => {
    it('KC site', () => {
      customRender(<KybKC />, originStore);
    });
  });

  describe('verifying', () => {
    const store = merge({}, originStore, {
      kyc: {
        kybInfo: {
          verifyStatus: 0,
        },
        kybCompanyDetail: {
          currentPhase: 5
        }
      },
    });
    it('KC site', () => {
      customRender(<KybKC />, store);
    });
  });

  describe('rejected', () => {
    describe('KC site', () => {
      it('rejected', async () => {
        const store = merge({}, originStore, {
          kyc: {
            kybInfo: {
              verifyStatus: 2,
            },
            kybCompanyDetail: {
              currentPhase: 5,
              verifyFailReason: {
                code: '查无此号码'
              },
              additionOperatorAttachment: true,
              additionOperatorAttachmentList: [23]
            }
          },
        });
        customRender(<KybKC />, store);
      });

      it('supplementary material', async () => {
        const store = merge({}, originStore, {
          kyc: {
            kybInfo: {
              verifyStatus: 2,
            },
            kybCompanyDetail: {
              currentPhase: 5,
              verifyFailReason: {},
              additionOperatorAttachment: true,
              additionOperatorAttachmentList: [23]
            }
          },
        });
        
        customRender(<KybKC />, store);
      });
    })
  });

  describe('verified', () => {
    const store = merge({}, originStore, {
      kyc: {
        kybInfo: {
          verifyStatus: 1,
        },
      },
    });

    it('KC site', () => {
      customRender(<KybKC />, store);
    });
  });
});