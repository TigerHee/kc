import { getQueryVariable, getFranceKycByRCODE, checkUrlListMath, checkFranceV2 } from './utils';
import { BelgiumPaths, francePathV2, TOCPath } from './config';
import { tenantConfig, tenant } from './tenant';

// 判断规则
// 法国IP识别，第一版合规
const checkFRV1 = (config) => {
  return config.isIntercept;
};

// 判断规则
// 法国rcode，第二版合规
const checkFRV2 = (config, rcode, pathName) => {
  return config.interceptV3 && checkFranceV2(francePathV2, rcode, pathName);
};

// 判断规则
// 比利时IP及url判断，第一版合规
const checkBEV1 = (config, pathName) => {
  const isKYCMatch = config.interceptV2 && config.regionV2 === 'BE';
  return isKYCMatch && checkUrlListMath(BelgiumPaths, pathName);
};

// 判断规则
// 营销土耳其，TOB、TOC合规
const checkTR_TOBTOC = (config, pathName) => {
  const isTR = config.regionV2 === 'TR';
  try {
    // rcode对应的用户kyc身份，是否满足屏蔽条件
    const isKYCMatch = config.interceptV2 && isTR;
    // rcode对应的用户，是否是合伙人
    // 邀请人渠道：TobReferral-TOB合伙人、TocReferral-通过邀请返佣注册的
    const isTobPartner = config.inviterCategory === 'TobReferral';
    const isTOBForbidden = isKYCMatch && isTobPartner;
    const isToCForbidden = isKYCMatch && checkUrlListMath(TOCPath, pathName);
    return isTOBForbidden || isToCForbidden;
  } catch (e) {
    console.error(e);
    // 处理异常-土耳其合规按从严处理
    return isTR;
  }
};

export default function complianceFR() {
  // 非 global 站不执行
  if (tenant && !tenantConfig.enableComplianceFR) {
    return;
  }
  try {
    if (typeof window === 'undefined') return;
    const siteConfig = window._WEB_RELATION_ || {};
    const { KUCOIN_HOST } = siteConfig;

    const _HOST = KUCOIN_HOST || window.location.origin;

    const forbiddenUrl = '/forbidden';
    // 当前页面就是屏蔽页面，就不需要判断合规了
    if (window.location.pathname.indexOf(forbiddenUrl) !== -1) return;

    const rcode = getQueryVariable('rcode') || '';
    // 没有rcode，无需继续执行
    if (!rcode) return;
    const pathName = window.location.pathname;
    getFranceKycByRCODE(rcode, function(err, res) {
      if (pathName !== window.location.pathname) return;
      if (err || !res || !res.success || !res.data) return;
      const config = res.data || {};
      const judgeList = [
        // 法国IP合规
        checkFRV1(config),
        // 比利时KYC合规
        checkBEV1(config, pathName),
        // 法国IP/rcode合规
        checkFRV2(config, rcode, pathName),
        // TOBTOC 土耳其合规
        checkTR_TOBTOC(config, pathName),
      ];
      try {
        // 一个规则都不匹配，没有合规跳转
        if (!judgeList.some((isForbidden) => !!isForbidden)) return;
        // 有任意一个合规拦截，跳转屏蔽页面
        const redirectUrl = `${(_HOST || '') + forbiddenUrl}/${config.region || 'default'}`;
        window.location.href = redirectUrl;
      } catch (e) {
        console.error(e);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

if (typeof window !== 'undefined' && !window.__COMPLIANCE_FR_START__) {
  window.__COMPLIANCE_FR_START__ = true;
  complianceFR();
}
