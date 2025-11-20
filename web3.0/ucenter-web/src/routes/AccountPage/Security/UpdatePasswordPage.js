/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { goVerifyLegacy } from '@kucoin-gbiz-next/verification';
import { Box, withResponsive, withSnackbar } from '@kux/mui';
import UpdatePwdForm from 'components/Account/SecurityForm/UpdatePasswordForm';
import React from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import { sentryReport } from 'src/tools/sentry';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';
import { StyledTitle, WithMinHeight, Wrapper } from './style';

@withResponsive
@withSnackbar()
@connect((state) => {
  const loading = state.loading.effects['account_security/updateLP'];
  const { user: { existLoginPsd = true } = {} } = state.user;
  return {
    loading,
    existLoginPsd,
  };
})
@injectLocale
class PageSecUpdatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
    };
  }

  /**
   * 处理提交事件
   */
  handleSubmit = async (values) => {
    const { dispatch, message, existLoginPsd } = this.props;
    const { oldPassword, newPassword } = values;
    const self = this;
    try {
      let res;
      // 如果没有登陆密码，就是设置新密码流程
      if (!existLoginPsd) {
        // 接入安全验证组件
        const verifyRes = await goVerifyLegacy({ bizType: 'RV_LOGIN_PWD_SET' });
        if (verifyRes) {
          res = await dispatch({
            type: 'account_security/setLoginPwd',
            payload: {
              newPassword,
              headers: verifyRes.headers,
            },
          });
        }
      } else {
        // 原先的更新密码
        res = await dispatch({
          type: 'account_security/updateLP',
          payload: {
            oldPassword,
            newPassword,
          },
        });
      }
      if (res && res.code === '200') {
        message.info(_t('convert.order.status.success'));
        self.next();
        return;
      }
      // 接口返回 code 不为 200 时，上报异常
      sentryReport({
        level: 'warning',
        message: `${existLoginPsd ? 'update' : 'set'} password error: ${res}`,
        tags: {
          errorType: 'password_warning_code_not_200',
        },
        fingerprint: 'password_warning_code_not_200',
      });
    } catch (e) {
      // 接口异常时，上报异常
      sentryReport({
        level: 'warning',
        message: `${existLoginPsd ? 'update' : 'set'} password error: ${e}`,
        tags: {
          errorType: existLoginPsd ? 'update_password_error' : 'set_password_error',
        },
        fingerprint: existLoginPsd ? 'update_password_error' : 'set_password_error',
      });
      console.error(e);
    }
  };

  next = (isBack = false) => {
    const n = (this.state.step + (isBack ? -1 : 1)) % 3;
    if (n > 1) {
      replace('/account/security');
    }
    this.setState({
      step: n,
    });
  };

  render() {
    const { loading, existLoginPsd, responsive } = this.props;
    const { step } = this.state;
    const isH5 = !responsive.sm;

    const contentMap = {
      1: (
        <UpdatePwdForm
          loading={loading}
          onSubmit={this.handleSubmit}
          existLoginPsd={existLoginPsd}
        />
      ),
    };

    return (
      <WithMinHeight data-inspector="account_security_password">
        <Wrapper>
          <Back />
          <Box style={{ height: isH5 ? '24px' : '52px' }} />
          <StyledTitle>
            {existLoginPsd ? _t('password.change') : _t('8ec8652b42e14000a0ab')}
          </StyledTitle>
          {contentMap[step]}
        </Wrapper>
      </WithMinHeight>
    );
  }
}

export default PageSecUpdatePassword;
