import { merge } from 'lodash';
import KybTH from 'src/routes/AccountPage/Kyc/KybHome/site/TH';
import KybTR from 'src/routes/AccountPage/Kyc/KybHome/site/TR';
import KybKCV2 from 'src/routes/AccountPage/Kyc/Kyb/Home/site/KC';
import { customRender } from 'test/setup';

const originStore = {
  kyc: {
    kybInfo: {
      verifyStatus: -1,
    },
    kybPrivileges: {},
  },
};

describe('kyb', () => {
  const originRequestIdleCallback = window.requestIdleCallback;
  const originCcancelIdleCallback = window.cancelIdleCallback;

  window.requestIdleCallback = jest.fn();
  window.cancelIdleCallback = jest.fn();

  afterAll(() => {
    window.requestIdleCallback = originRequestIdleCallback;
    window.cancelIdleCallback = originCcancelIdleCallback;
  });

  describe('unverified', () => {

    it('KC site V2', () => {
      customRender(<KybKCV2 />, originStore);
    });

    it('TR site', () => {
      customRender(<KybTR />, originStore);
    });

    it('TH site', () => {
      customRender(<KybTH />, originStore);
    });
  });

  describe('verifying', () => {
    const store = merge({}, originStore, {
      kyc: {
        kybInfo: {
          verifyStatus: 0,
        },
      },
    });
    
    it('KC site V2', () => {
      customRender(<KybKCV2 />, originStore);
    });

    it('TR site', () => {
      customRender(<KybTR />, store);
    });

    it('TH site', () => {
      customRender(<KybTH />, store);
    });
  });

  describe('rejected', () => {
    const store = merge({}, originStore, {
      kyc: {
        kybInfo: {
          verifyStatus: 2,
        },
      },
    });
    
    it('KC site V2', () => {
      customRender(<KybKCV2 />, originStore);
    });

    it('TR site', () => {
      customRender(<KybTR />, store);
    });

    it('TH site', () => {
      customRender(<KybTH />, store);
    });
  });

  describe('verified', () => {
    const store = merge({}, originStore, {
      kyc: {
        kybInfo: {
          verifyStatus: 1,
        },
      },
    });
    
    it('KC site V2', () => {
      customRender(<KybKCV2 />, originStore);
    });

    it('TR site', () => {
      customRender(<KybTR />, store);
    });

    it('TH site', () => {
      customRender(<KybTH />, store);
    });
  });
});
