/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Box, styled, withResponsive, withSnackbar } from '@kux/mui';
import BindG2FAForm from 'components/Account/SecurityForm/BindG2FAForm';
import SecurityAuthForm from 'components/Account/SecurityForm/SecurityAuthForm';
import { tenantConfig } from 'config/tenant';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';
import SecBase from './SecPageBase';
import { StyledTitle, WithMinHeight, Wrapper } from './style';

const AccountSecurityG2af = styled(WithMinHeight)`
  .KuxAlert-description {
    margin-top: 0;
  }
`;

@withResponsive
@withSnackbar()
@connect((state) => {
  const { g2faKey } = state.account_security;
  const { securtyStatus } = state.user;
  const loading = state.loading.effects['account_security/bindG2AF'];
  const bizType = securtyStatus.GOOGLE2FA ? 'UPDATE_GOOGLE_2FA' : 'BIND_GOOGLE_2FA';
  return {
    ...state.user,
    g2faKey,
    loading,
    bizType,
  };
})
@injectLocale
export default class BindG2AFPage extends SecBase {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      allowTypes: [],
    };
  }

  nextStep = (isBack = false) => {
    const { step } = this.state;
    // this.setState({ step: this.state.step + 1 });
    // const { securtyStatus = {} } = this.props;
    const nextStep = step + (isBack ? -1 : 1);
    // 设置和修改的展示不同
    if (step === 2 || isBack) {
      window.history.length > 1 ? window.history.go(-1) : replace('/account/security');
    }
    this.setState({ step: nextStep });
  };

  handleModify = () => {
    const { bizType } = this.props;
    this.getAuthType(bizType);
    this.setState({ step: 1 });
  };

  modelName = 'account_security';

  handleSubmit = (values) => {
    const { dispatch, g2faKey, securtyStatus = {}, message } = this.props;
    const { code } = values;
    const self = this;

    dispatch({
      type: 'account_security/bindG2AF',
      payload: {
        code,
        key: g2faKey,
        isUpdate: !!securtyStatus.GOOGLE2FA,
      },
    }).then(
      async (res) => {
        if (res && res.code === '200') {
          await dispatch({
            type: 'user/pullUser',
          });
          self.nextStep();
          message.success(_t('operation.succeed'));
        }
      },
      (error) => {
        if (error.code === '40006') {
          this.nextStep(true);
        }
        // message.error(error.msg);
      },
    );
  };

  componentDidMount() {
    const { dispatch, bizType } = this.props;
    dispatch({
      type: `${this.modelName}/getG2FAKey`,
    });
    this.getAuthType(bizType);
  }

  render() {
    const { securtyStatus, user, dispatch, g2faKey, loading, responsive } = this.props;
    const isH5 = !responsive.sm;
    const { step, allowTypes } = this.state;
    const switchAble = securtyStatus.SMS && securtyStatus.GOOGLE2FA;
    const bizType = securtyStatus.GOOGLE2FA ? 'UPDATE_GOOGLE_2FA' : 'BIND_GOOGLE_2FA';
    const authType = securtyStatus.GOOGLE2FA
      ? 'google_2fa'
      : securtyStatus.SMS
      ? 'my_sms'
      : 'my_email';
    const title = (
      // change.g2fa
      <div>{securtyStatus.GOOGLE2FA ? _t('change.g2fa') : _t('set.g2fa')}</div>
    );
    const commonProps = {
      bindKey: g2faKey,
      dispatch,
      bizType,
      onSuccess: this.nextStep,
    };

    return (
      <AccountSecurityG2af data-inspector="account_security_gfa">
        {step === 1 && (
          <Wrapper>
            <SecurityVerifyModal visible={true}>
              <SecurityAuthForm
                showTip
                showAlert={true}
                showTitle={false}
                replaceMessage={tenantConfig.resetG2fa.tipsMsg(_t)}
                allowTypes={allowTypes}
                type={authType}
                switchAble={switchAble}
                {...commonProps}
              />
            </SecurityVerifyModal>
          </Wrapper>
        )}
        {step === 2 && (
          <Wrapper>
            <Back />
            <Box style={{ height: isH5 ? '24px' : '52px' }} />
            <StyledTitle>{title}</StyledTitle>
            <BindG2FAForm
              {...commonProps}
              loading={loading}
              showTitle={false}
              onSubmit={this.handleSubmit}
              isUpdate={securtyStatus.GOOGLE2FA}
              user={user}
            />
          </Wrapper>
        )}
      </AccountSecurityG2af>
    );
  }
}
