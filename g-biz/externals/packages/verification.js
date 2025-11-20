/**
 * Owner: vijay.zhou@kupotech.com
 */
import '@packages/verification/src/common/httpInterceptors';
// import withI18nReady from '@hooks/withI18nReady';
// import { default as OriginForm } from '@packages/verification/src/components/SecurityVerifyForm';

// 暂时没有使用场景，等以后需要再开放
// 开放前须知：此组件还没有相应的埋点
// export const SecurityVerifyForm = withI18nReady(OriginForm, 'verification');

export { default as checkAvailable } from '@packages/verification/src/utils/checkAvailable';
export { default as goVerify } from '@packages/verification/src/utils/goVerify';
export { default as ClaimErrorInfo } from '@packages/verification/src/components/ClaimErrorInfo';
