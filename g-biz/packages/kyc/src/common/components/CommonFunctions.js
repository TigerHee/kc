/**
 * Owner: iron@kupotech.com
 */
import { forEach, isEmpty, isString } from 'lodash';

export const kycSeniorSubmit = async ({
  values,
  onSuccessCallback,
  onError,
  dispatch,
  service,
  identity2VerifyFailedCallback,
}) => {
  const data = await dispatch({ type: service, payload: values });
  if (!data.success && data.identity2VerifyFailed) {
    identity2VerifyFailedCallback &&
      typeof identity2VerifyFailedCallback === 'function' &&
      identity2VerifyFailedCallback(); // 身份验证2次失败
  }
  if (data.success) {
    // eslint-disable-next-line no-unused-expressions
    onSuccessCallback && typeof onSuccessCallback === 'function' && onSuccessCallback();
  }
  if (!data.success && data.msg) {
    // eslint-disable-next-line no-unused-expressions
    onError && typeof onError === 'function' && onError(data.msg);
  }
};

export const filterParams = (values) => {
  const filterParams = { ...values };
  const keys = Object.keys(filterParams);
  forEach(keys, (key) => {
    if (
      !filterParams[key] ||
      (isString(filterParams[key]) && !filterParams[key].trim()) ||
      isEmpty(filterParams[key])
    ) {
      delete filterParams[key];
    }
  });
  return filterParams;
};
