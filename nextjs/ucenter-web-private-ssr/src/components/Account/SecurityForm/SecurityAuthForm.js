/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Form, styled, withSnackbar } from '@kux/mui';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import SecForm from '../../NewCommonSecurity';
import AlertInfo from './Alert';

// 安全验证表单, 第一个为默认值
// Props: {
//   type: 'google_2fa' | 'my_sms' | 'my_email'  默认验证类型：谷歌验证、短信验证、邮件验证,
//   bizType: 对应后端业务类型,
//   showTip: false | true  显示“为了防止被恶意修改，修改后24h内禁止场外交易和提现”的提示
//   swicthAble: false | true  是否可切换其他验证
//   onSuccess: function  验证通过之后的回调
// }

const FormWrapper = styled.div`
  width: 100%;
  .KuxAlert-description {
    margin-top: 0;
  }
  .KuxAlert-icon {
    padding-right: 8px;
    padding-left: unset;
  }
`;

const FormTitle = styled.div`
  margin: 48px 0;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  text-align: center;
`;

const FormBody = styled.div`
  max-width: 100%;
  margin: 0px auto 0px;
  max-width: 580px;

  [dir='rtl'] & {
    .KuxForm-itemRowContainer .KuxCol-col {
      text-align: right /* rtl:ignore */;
    }
  }

  [dir='rtl'] & {
    .KuxInput-togglePwdIcon {
      transform: scaleX(-1);
    }
  }
`;

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
      showAbnormalInfo,
      showAlert = true,
      withPwd,
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
          <SecForm
            withPwd={!!withPwd}
            form={form}
            autoSubmit
            bizType={bizType}
            updator={updator}
            allowTypes={allowTypes}
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
