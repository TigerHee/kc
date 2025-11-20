/**
 * Owner: willen@kupotech.com
 */
import { forEach } from 'lodash-es';
import { track } from 'utils/ga';
import { FIELD_ERROR_MAP, TRADE_OPTIONS } from '../../common/constants';

const kybLevel = {
  kycCompBasicSubmit: 'company',
  submitCompanyContact: 'applicant',
  submitKycCompMoreImg: 'documents',
};

let extraDataBase = {};

export const kycSeniorSubmit = async ({
  values,
  onSuccessCallback,
  onError,
  dispatch,
  service,
}) => {
  const data = await dispatch({ type: `kyc/${service}`, payload: values });
  let kyb_submit_result = null;
  if (data.success) {

    onSuccessCallback && typeof onSuccessCallback === 'function' && onSuccessCallback();

    kyb_submit_result = 'success';
  } else {
    kyb_submit_result = 'fail';
  }
  if (!data.success && data.msg) {

    onError && typeof onError === 'function' && onError(data.msg);
  }

  // 埋点
  const extraData = {
    ...extraDataBase,
    apply_kyb_level: kybLevel[service],
    TerminalType: 'js',
    kyb_submit_terminal: /Mobile|Android|Windows Phone/gi.test(navigator.userAgent)
      ? 'web_mobile'
      : 'web_pc',
    kyb_submit_result,
    apply_type: 'user',
  };
  if (service === 'kycCompBasicSubmit') {
    extraData.trading_volume = TRADE_OPTIONS.find((i) => i.code === values?.tradeAmount)?.value;
  }
  extraDataBase = { ...extraData };

  track('kyb_submit_result', extraData);
};

export const filterParams = (values) => {
  const filteredParams = { ...values };
  const keys = Object.keys(filteredParams);
  forEach(keys, (key) => {
    if (
      filteredParams[key] === null ||
      filteredParams[key] === undefined ||
      filteredParams[key].trim() === ''
    ) {
      delete filteredParams[key];
    }
  });
  return filteredParams;
};

let renderSequence = 0;

export const resetRenderSequence = () => {
  renderSequence = 0;
};

export const onValuesChange = ({ dispatch, failureReason }, changedFields) => {
  if (renderSequence > 1) {
    const field = Object.keys(changedFields)[0];
    const filteredReasons = { ...failureReason };
    const reasonField = FIELD_ERROR_MAP[field];
    if (reasonField) {
      delete filteredReasons[reasonField];
      dispatch({
        type: 'kyc/update',
        payload: { failureReason: filteredReasons },
      });
    }
  } else {
    renderSequence += 1;
  }
};
