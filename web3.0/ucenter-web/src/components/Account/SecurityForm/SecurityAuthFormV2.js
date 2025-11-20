/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Form, withSnackbar } from '@kux/mui';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import SecFormV2 from '../../NewCommonSecurity/v2';
import AlertInfo from './Alert';
import { FormBody, FormTitle, FormWrapper } from './styled';

const noop = () => {};
const { withForm } = Form;
@withSnackbar()
@connect((state) => {
  const isLoading = state.loading.effects['account_security/verifyCode'];
  return {
    isLoading,
  };
})
@withForm()
@injectLocale
export default class SecurityAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type || 'google_2fa',
      isGetingCode: false,
      retryAfterSeconds: 0,
      allowTypes: [],
    };
  }

  static defaultProps = {
    showTip: false,
    switchAble: false,
    // title: _t('security.verify'),
  };

  handleSuccess = (vResult) => {
    const { onSuccess = noop, onError = () => {}, passError, message } = this.props;
    if (vResult && vResult.code === '200') {
      onSuccess();
    } else {
      message.error(vResult.msg || 'ERROR');
      if (passError) {
        onError(vResult);
      } else {
        onError();
      }
    }
  };

  isShow24HDisable = () => {
    const { bizType } = this.props;
    return [
      'BIND_PHONE',
      'UPDATE_PHONE',
      'UPDATE_GOOGLE_2FA',
      'FORGET_WITHDRAWAL_PASSWORD',
      'UPDATE_PRIMARY_KYC',
    ].includes(bizType);
  };

  render() {
    const {
      form,
      bizType,
      allowTypes,
      title,
      updator,
      replaceMessage,
      submitBtnTxt,
      confirmLoading,
      showTitle = true,
      showAbnormalInfo = true,
      showAlert = true,
    } = this.props;
    const { type } = this.state;
    const authTitle = title || _t('security.verify');
    return (
      <FormWrapper key={type}>
        {bizType !== 'UPDATE_PRIMARY_KYC' && !!showTitle && <FormTitle>{authTitle}</FormTitle>}
        {bizType !== 'UPDATE_PRIMARY_KYC' && showAlert && this.isShow24HDisable() && (
          <AlertInfo replaceMessage={replaceMessage} />
        )}
        <FormBody>
          <SecFormV2
            form={form}
            autoSubmit
            bizType={bizType}
            updator={updator}
            allowTypes={allowTypes}
            // allowTypes={[['google_2fa'], ['my_email'], ['my_sms']]}
            callback={this.handleSuccess}
            confirmLoading={confirmLoading}
            showAbnormalInfo={showAbnormalInfo}
            submitBtnTxt={submitBtnTxt || _t('next')}
          />
        </FormBody>
      </FormWrapper>
    );
  }
}
