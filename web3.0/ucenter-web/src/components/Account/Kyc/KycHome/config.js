/**
 * Owner: lena@kupotech.com
 */
import { _t, _tHTML } from 'tools/i18n';

// kyc2/机构kyc认证状态
export const VERIFY_STATUS = {
  // 自动化kyc转人工待审核
  '-2': {
    code: -2,
  },
  // 未提交
  '-1': {
    code: -1,
  },
  // 待审核
  0: {
    code: 0,
  },
  // 审核通过
  1: {
    code: 1,
  },
  // 审核不通过
  2: {
    code: 2,
  },
  // 待AML人工审核
  3: {
    code: 3,
  },
  // 人工审核不通过
  4: {
    code: 4,
  },
  // 该国家不支持高级KYC
  // EKYC: 包含美国/日本假失败的情况,regionCode: OT verifyStatus: 5
  5: {
    code: 5,
  },
  // EKYC-OCR认证中
  6: {
    code: 6,
  },
  // EKYC-活体检测中
  7: {
    code: 7,
  },
  // EKYC-自动KYC认证失败
  8: {
    code: 8,
  },
};
// 认证类型
export const TYPE = {
  noCommit: -1, // 未提交
  personal: 0, // 个人认证
  institution: 1, // 机构认证
};
//kyc状态
export const getKycStatus = (kycInfo = {}) => {
  const { type, primaryVerifyStatus, verifyStatus } = kycInfo || {};
  if (type === TYPE.noCommit) {
    //未提交kyc
    return 1;
  }
  if (type === TYPE.personal) {
    //个人kyc
    // if (primaryVerifyStatus === PRIMARY_VERIFY_STATUS.noPass) {
    //   //kyc1未通过
    //   return 1;
    // }
    // if (primaryVerifyStatus === PRIMARY_VERIFY_STATUS.pass) {
    //kyc1通过
    if (verifyStatus === VERIFY_STATUS['-1'].code) {
      //未提交kyc2
      return 2;
    }
    if (
      [
        VERIFY_STATUS['-2'].code, //自动化kyc转人工待审核
        VERIFY_STATUS['0'].code, //kyc2待审核
        VERIFY_STATUS['3'].code, //kyc2待待AML人工审核
        VERIFY_STATUS['6'].code, //kyc2 EKYC-OCR认证中
        VERIFY_STATUS['7'].code, //kyc2 EKYC-活体检测中
      ].includes(verifyStatus)
    ) {
      //认证中
      return 3;
    }
    if (verifyStatus === VERIFY_STATUS['1'].code) {
      //kyc2审核通过
      return 4;
    }
    if (verifyStatus === VERIFY_STATUS['5'].code) {
      //kyc2假失败,国家地区受限
      return 5;
    }
    if (
      //2:kyc2失败，4:kyc2人工审核不通过,8:kyc2EKYC-自动KYC认证失败
      [VERIFY_STATUS['2'].code, VERIFY_STATUS['4'].code, VERIFY_STATUS['8'].code].includes(
        verifyStatus,
      )
    ) {
      //kyc2失败
      return 6;
    }
    // }
  }
  return 1;
};
export const getKycLevel = (kycInfo = {}) => {
  //用户上传人脸照片，高级kyc状态保持不变
  //verifyStatus为1，高级认证通过，等级为kyc3
  //verifyStatus为-1，高级认证未做，intermediateVerifyStatus为1则等级为kyc2，intermediateVerifyStatus为0等级为kyc1
  //verifyStatus不为1和-1，高级认证失败，新用户intermediateVerifyStatus一定为1，等级为kyc2，上传入口关闭。老用户intermediateVerifyStatus为0，等级为kyc1，就会有上传入口，再做一次等级升为kyc2，上传入口关闭
  //限制国家展示等级做多均为1
  const { type, primaryVerifyStatus, verifyStatus, intermediateVerifyStatus, regionType } =
    kycInfo || {};
  const status = getKycStatus(kycInfo);
  if (verifyStatus === 1) {
    // 受限国家
    if ([1, 2].includes(regionType)) {
      return {
        btnText: '',
        level: 1,
        showBtn: false,
        title: _t('umUZ2cuoPXGf7GrdgbXf6A'),
        isVerifying: true,
        failedType: 'false',
      };
    }
    //kyc3审核通过,等级为kyc3
    return { title: '', btnText: '', level: 3, showBtn: false };
  }
  if (verifyStatus === -1) {
    //高级认证未做
    if (intermediateVerifyStatus === 0) {
      if (type === -1 || primaryVerifyStatus === 0) {
        //未提交kyc,等级为kyc0
        return { btnText: _t('ujZc9hLkSmYHhQy4CQHo6u'), level: 0, showBtn: true };
      }
      return { btnText: _t('prYLqSst5vbHXHnauLRNM1'), title: '', level: 1, showBtn: true };
    }
    //用户上传人脸照片，高级kyc状态保持不变
    if (intermediateVerifyStatus === 1) {
      //regionType:1-一级限制国家哎，2-二级限制国家，3-正常国家
      if ([1, 2].includes(regionType)) {
        return {
          btnText: '',
          level: 1,
          showBtn: false,
          title: _tHTML('iegb6xzGM6jEFYCy66Fp6g'),
          showReVerification: true,
        };
      }
      return { btnText: _t('prYLqSst5vbHXHnauLRNM1'), title: '', level: 2, showBtn: true };
    }
  }
  if (verifyStatus !== 1 && verifyStatus !== -1) {
    if (intermediateVerifyStatus === 0) {
      //兼容老用户
      //高级认证中
      if (status === 3) {
        return {
          title: _t('umUZ2cuoPXGf7GrdgbXf6A'),
          btnText: '',
          level: 1,
          showBtn: false,
          isVerifying: true,
        };
      }
      if (status === 5) {
        //假失败
        return {
          btnText: '',
          level: 1,
          showBtn: false,
          title: _t('umUZ2cuoPXGf7GrdgbXf6A'),
          isVerifying: true,
          failedType: 'false',
        };
      }
      //高级认证失败
      if (status === 6) {
        return {
          btnText: _t('mwdwXUvagzZaLxv8oYUZLr'),
          title: _tHTML('4uVfEqapQ5qKnUKYm5176L'),
          level: 1,
          showBtn: true,
          failedType: 'real',
        };
      }
      return { btnText: _t('prYLqSst5vbHXHnauLRNM1'), title: '', level: 1, showBtn: true };
    }
    if (intermediateVerifyStatus === 1) {
      //新用户
      //高级认证中
      if (status === 3) {
        return {
          title: _t('umUZ2cuoPXGf7GrdgbXf6A'),
          btnText: '',
          level: [1, 2].includes(regionType) ? 1 : 2,
          showBtn: false,
          isVerifying: true,
        };
      }
      if (status === 5) {
        //假失败
        return {
          btnText: '',
          level: 1,
          showBtn: false,
          title: _t('umUZ2cuoPXGf7GrdgbXf6A'),
          isVerifying: true,
          failedType: 'false',
        };
      }
      //高级认证失败
      if (status === 6) {
        return {
          btnText: _t('mwdwXUvagzZaLxv8oYUZLr'),
          title: _tHTML('4uVfEqapQ5qKnUKYm5176L'),
          level: [1, 2].includes(regionType) ? 1 : 2,
          showBtn: true,
          failedType: 'real',
        };
      }
      return {
        title: _t('umUZ2cuoPXGf7GrdgbXf6A'),
        btnText: '',
        level: 2,
        showBtn: false,
        isVerifying: true,
      };
    }
  }
  if (type === -1 || primaryVerifyStatus === 0) {
    //未提交kyc,等级为kyc0
    return { btnText: _t('ujZc9hLkSmYHhQy4CQHo6u'), level: 0, showBtn: true };
  }
};
