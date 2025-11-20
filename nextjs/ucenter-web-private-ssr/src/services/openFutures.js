/**
 * Owner: willen@kupotech.com
 */
import { getCurrentLangFromPath } from 'tools/i18n';
import memStorage from 'tools/memStorage';
import { post, pull } from 'tools/request';
import { getSiteConfig } from 'kc-next/boot';
import storage from 'utils/storage';

// 同意风险协议
export async function agreeRisk(params) {
  return post('/ucenter/agree-risk-agreement', params);
}

// 同意用户协议
export async function agreeUser(params) {
  return post('/ucenter/agree-user-agreement', params);
}

//  开通合约交易
export async function openUserContract() {
  return post('/ucenter/open-contract');
}

// 获取开通合约奖励
export function postGetOpenFuturesBonus() {
  const siteConfig = getSiteConfig();
  const { KUMEX_GATE_WAY } = siteConfig;
  const langByPath = getCurrentLangFromPath();
  const query = {};
  query.c = memStorage.getItem('csrf') || undefined;
  query.lang = langByPath || storage.getItem('lang');
  return post(
    `${KUMEX_GATE_WAY}/kumex-promotion/trialFunds/receive-open-contract-rewards?c=${query.c}&lang=${query.lang}`,
  );
  // return post('/kumex-promotion/trialFunds/receive-open-contract-rewards');
}

// 检查是否有开通合约奖励
export function getOpenFuturesIsBonus(params) {
  const siteConfig = getSiteConfig();
  const { KUMEX_GATE_WAY } = siteConfig;
  const langByPath = getCurrentLangFromPath();
  const query = {};
  query.c = memStorage.getItem('csrf') || undefined;
  query.lang = langByPath || storage.getItem('lang');
  return pull(
    `${KUMEX_GATE_WAY}/kumex-promotion/trialFunds/check-open-contract-rewards?c=${query.c}&lang=${query.lang}`,
    params,
  );
  // return pull('/kumex-promotion/trialFunds/check-open-contract-rewards', params);
}

// 检查是否开通合约
export async function getOpenStatus() {
  return pull('/ucenter/is-open', { type: 'CONTRACT' });
}
