import { getKycLevel, getKycStatus } from 'src/components/Account/Kyc/KycHome/config';

let kycInfo;

beforeEach(() => {
  kycInfo = {
    type: -1,
    verifyStatus: -1,
    regionType: 3,
    primaryVerifyStatus: -1,
    intermediateVerifyStatus: undefined,
  };
});

describe('kyc config', () => {
  describe('kyc status', () => {
    it('no kyc', () => {
      expect(getKycStatus()).toEqual(1);
      expect(getKycStatus(kycInfo)).toEqual(1);
    });

    describe('personal kyc', () => {
      beforeEach(() => {
        kycInfo.type = 0;
      });

      it('kyc2 was not submitted', () => {
        kycInfo.verifyStatus = -1;
        expect(getKycStatus(kycInfo)).toEqual(2);
      });

      describe('kyc2 is authenticating', () => {
        it('Automated KYC to manual transfer pending review', () => {
          kycInfo.verifyStatus = -2;
          expect(getKycStatus(kycInfo)).toEqual(3);
        });

        it('kyc2 pending review', () => {
          kycInfo.verifyStatus = 0;
          expect(getKycStatus(kycInfo)).toEqual(3);
        });

        it('kyc2 is pending manual review by AML', () => {
          kycInfo.verifyStatus = 3;
          expect(getKycStatus(kycInfo)).toEqual(3);
        });

        it('kyc2 EKYC-OCR certification in progress', () => {
          kycInfo.verifyStatus = 6;
          expect(getKycStatus(kycInfo)).toEqual(3);
        });

        it('kyc2 EKYC-in vivo detection', () => {
          kycInfo.verifyStatus = 7;
          expect(getKycStatus(kycInfo)).toEqual(3);
        });
      });

      it('kyc2 passed', () => {
        kycInfo.verifyStatus = 1;
        expect(getKycStatus(kycInfo)).toEqual(4);
      });

      it('kyc2 fake failed', () => {
        kycInfo.verifyStatus = 5;
        expect(getKycStatus(kycInfo)).toEqual(5);
      });

      describe('kyc2 failed', () => {
        it('failed', () => {
          kycInfo.verifyStatus = 2;
          expect(getKycStatus(kycInfo)).toEqual(6);
        });

        it('kyc2 manual review failed', () => {
          kycInfo.verifyStatus = 4;
          expect(getKycStatus(kycInfo)).toEqual(6);
        });

        it('kyc2EKYC-Automatic KYC authentication failed', () => {
          kycInfo.verifyStatus = 8;
          expect(getKycStatus(kycInfo)).toEqual(6);
        });
      });
    });

    it('institution kyc', () => {
      kycInfo.type = 1;
      expect(getKycStatus(kycInfo)).toEqual(1);
    });
  });
});

describe('kyc level', () => {
  it('level 0', () => {
    // 未认证的老用户
    expect(getKycLevel(kycInfo).level).toEqual(0);

    // 似乎是兜底的？
    expect(
      getKycLevel({
        ...kycInfo,
        intermediateVerifyStatus: 0,
      }).level,
    ).toEqual(0);
  });

  it('level 1', () => {
    // 高级认证通过，但国家受限
    expect(
      getKycLevel({
        ...kycInfo,
        verifyStatus: 1,
        regionType: 1,
      }).level,
    ).toEqual(1);

    // 未做高级认证的老用户
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        intermediateVerifyStatus: 0,
      }).level,
    ).toEqual(1);

    // 未做高级认证
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        regionType: 1,
        intermediateVerifyStatus: 1,
      }).level,
    ).toEqual(1);

    // 高级认证中的老用户
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        verifyStatus: 0,
        intermediateVerifyStatus: 0,
      }).level,
    ).toEqual(1);

    // 老客户高级认证失败
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        verifyStatus: 4,
        intermediateVerifyStatus: 0,
      }).level,
    ).toEqual(1);

    // 老客户假失败
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        verifyStatus: 5,
        intermediateVerifyStatus: 0,
      }).level,
    ).toEqual(1);

    // 兜底
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        verifyStatus: 99,
        intermediateVerifyStatus: 0,
      }).level,
    ).toEqual(1);

    //新用户-国家受限
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        regionType: 1,
        intermediateVerifyStatus: 1,
      }).level,
    ).toEqual(1);

    // 新用户假失败
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        verifyStatus: 5,
        intermediateVerifyStatus: 1,
      }).level,
    ).toEqual(1);

    // 新用户认证失败
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        verifyStatus: 4,
        regionType: 1,
        intermediateVerifyStatus: 1,
      }).level,
    ).toEqual(1);
  });

  it('level 2', () => {
    // 新用户认证中，待上传照片
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        intermediateVerifyStatus: 1,
      }).level,
    ).toEqual(2);

    // 新用户重新认证
    expect(
      getKycLevel({
        ...kycInfo,
        verifyStatus: 0,
        type: 0,
        intermediateVerifyStatus: 1,
      }).level,
    ).toEqual(2);

    // 兜底？
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        verifyStatus: 99,
        intermediateVerifyStatus: 1,
      }).level,
    ).toEqual(2);
  });

  describe('level 3', () => {
    // 认证通过
    expect(
      getKycLevel({
        ...kycInfo,
        type: 0,
        verifyStatus: 1,
      }).level,
    ).toEqual(3);
  });
});
