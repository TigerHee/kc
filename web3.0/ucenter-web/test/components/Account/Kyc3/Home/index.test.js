import { merge } from 'lodash';
import KCKycHome from 'src/routes/AccountPage/Kyc/KycHome/site/KC/index';
import THKycHome from 'src/routes/AccountPage/Kyc/KycHome/site/TH/index';
import TRKycHome from 'src/routes/AccountPage/Kyc/KycHome/site/TR/index';
import { customRender } from 'test/setup';

jest.mock('@kucoin-gbiz-next/kyc', () => {
  return {
    __esModule: true,
    ComplianceDialog: () => {
      return null;
    },
  };
});

const originStore = {
  kyc: {
    kycInfo: {
      verifyStatus: -1,
      regionType: 3,
      primaryVerifyStatus: -1,
    },
    kycClearInfo: {
      clearStatus: -1,
      msg: 'msg',
      topMsg: 'topMsg',
    },
    privileges: {},
  },
  kyc_th: {
    kycInfo: {
      kycProcessStatus: -1,
      kybProcessStatus: -1,
      kycVerifyStatus: 0,
      kybVerifyStatus: 0,
    },
    privileges: {},
  },
  user: {
    recharged: false,
    isLogin: true,
  },
};

describe('kyc3/Home', () => {
  describe('no kyc', () => {
    const store = merge({}, originStore, {
      kyc: {
        kycInfo: {
          type: -1,
        },
      },
    });

    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, store);
    });

    it('TR site', () => {
      const triggerType = jest.fn();
      customRender(<TRKycHome triggerType={triggerType} />, store);
    });

    it('TH site', () => {
      customRender(<THKycHome />, store);
    });
  });

  describe('kyc unverified', () => {
    const store = originStore;
    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, store);
    });

    it('TR site', () => {
      const triggerType = jest.fn();
      customRender(<TRKycHome triggerType={triggerType} />, store);
    });

    it('TH site', () => {
      customRender(<THKycHome />, store);
    });
  });

  describe('kyc verifying', () => {
    const store = merge({}, originStore, {
      kyc: {
        kycInfo: {
          verifyStatus: 0,
        },
      },
      kyc_th: {
        kycInfo: {
          kycProcessStatus: 0,
          kybProcessStatus: -1,
        },
      },
    });
    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, store);
    });

    it('TR site', () => {
      const triggerType = jest.fn();
      customRender(<TRKycHome triggerType={triggerType} />, store);
    });

    it('TH site', () => {
      customRender(<THKycHome />, store);
    });
  });

  describe('kyc verified', () => {
    const store = merge({}, originStore, {
      kyc: {
        kycInfo: {
          verifyStatus: 1,
        },
      },
      kyc_th: {
        kycInfo: {
          kycVerifyStatus: 1,
          kycProcessStatus: 1,
        },
      },
    });
    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, merge(store));
    });

    describe('TR site', () => {
      it('no deposit', () => {
        const triggerType = jest.fn();
        customRender(<TRKycHome triggerType={triggerType} />, store);
      });

      it('deposit', () => {
        const triggerType = jest.fn();
        customRender(
          <TRKycHome triggerType={triggerType} />,
          merge({}, store, {
            user: {
              recharged: true,
            },
          }),
        );
      });
    });

    describe('TH site', () => {
      it('is login', () => {
        customRender(<THKycHome />, store);
      });

      it('not login', () => {
        customRender(
          <THKycHome />,
          merge({}, store, {
            user: {
              isLogin: false,
            },
          }),
        );
      });
    });
  });

  describe('kyc rejected', () => {
    const store = merge({}, originStore, {
      kyc: {
        kycInfo: {
          verifyStatus: 2,
        },
      },
      kyc_th: {
        kycInfo: {
          kycVerifyStatus: 0,
          kycProcessStatus: 1,
        },
      },
    });
    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, store);
    });

    it('TR site', () => {
      const triggerType = jest.fn();
      customRender(<TRKycHome triggerType={triggerType} />, store);
    });

    it('TH site', () => {
      customRender(<THKycHome />, store);
    });
  });

  describe('kyc fake', () => {
    const store = merge({}, originStore, {
      kyc: {
        kycInfo: {
          verifyStatus: 5,
        },
      },
    });

    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, store);
    });

    it('TR site', () => {
      const triggerType = jest.fn();
      customRender(<TRKycHome triggerType={triggerType} />, store);
    });
  });

  describe('kyc clearance', () => {
    const store = merge({}, originStore, {
      kyc: {
        kycClearInfo: {
          clearStatus: 1,
          msg: 'msg',
          topMsg: 'topMsg',
        },
      },
    });

    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, store);
    });

    it('TR site', () => {
      const triggerType = jest.fn();
      customRender(<TRKycHome triggerType={triggerType} />, store);
    });
  });

  describe('kyc reset', () => {
    const store = merge({}, originStore, {
      kyc: {
        kycClearInfo: {
          clearStatus: 2,
          msg: 'msg',
          topMsg: 'topMsg',
        },
      },
    });

    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, store);
    });

    it('TR site', () => {
      const triggerType = jest.fn();
      customRender(<TRKycHome triggerType={triggerType} />, store);
    });
  });

  describe('kyc suspend', () => {
    const store = merge({}, originStore, {
      kyc: {
        kycInfo: {
          verifyStatus: -1,
          primaryVerifyStatus: 1,
        },
      },
    });

    it('KC site', () => {
      const triggerType = jest.fn();
      customRender(<KCKycHome triggerType={triggerType} />, store);
    });

    it('TR site', () => {
      const triggerType = jest.fn();
      customRender(<TRKycHome triggerType={triggerType} />, store);
    });
  });
});
