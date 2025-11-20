import goVerify from './goVerify';

/** 旧版的验证组件用法 */
export default async function goVerifyLegacy({
  bizType,
  businessData = {},
  errorRender,
}) {
  console.warn('goVerifyLegacy is deprecated, please use goVerify instead.');
  return new Promise((resolve) => {
    goVerify({
      bizType,
      businessData,
      errorRender,
      onSuccess: (res) => resolve(res),
      onCancel: () => resolve(null)
    });
  });
}