import {
  ClaimErrorInfo as OriClaimErrorInfo,
} from 'packages/verification';

import withI18nReady from 'adaptor/tools/withI18nReady';

export const ClaimErrorInfo = withI18nReady(OriClaimErrorInfo, 'verification');

export { goVerify, goVerifyWithToken, goVerifyWithAddress } from 'packages/verification';

/** 以下是提供给未升级到 ssr 的项目使用方法，未避免太大的改动，保留原使用方式，后续会移除 */
export { default as checkAvailable } from 'packages/verification/src/utils/checkAvailable';
export { default as goVerifyLegacy } from 'packages/verification/src/utils/goVerifyLegacy';