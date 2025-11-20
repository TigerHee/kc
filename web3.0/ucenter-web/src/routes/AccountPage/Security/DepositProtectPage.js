/**
 * Owner: willen@kupotech.com
 */
import { Box, styled, withResponsive, withSnackbar } from '@kux/mui';
import DepositPasswordForm from 'components/Account/SecurityForm/DepositPasswordForm';
import SecurityAuthFormV2 from 'components/Account/SecurityForm/SecurityAuthFormV2';
import TradePasswordNoticeModal from 'components/common/TradePasswordNoticeModal';
import requireProps from 'hocs/requireProps';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';
import SecBase from './SecPageBase';

import { injectLocale } from '@kucoin-base/i18n';
import { intoPageGaName, siteidGaName } from 'config/base';
import Back from 'src/components/common/Back';
import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import { ga } from 'utils/ga';
import { StyledTitle, WithMinHeight, Wrapper } from './style';

const AccountSecurityProtect = styled(WithMinHeight)`
  .KuxAlert-description {
    margin-top: 0;
  }
`;

const authGa = () => {
  ga(intoPageGaName, {
    siteid: siteidGaName,
    siteid_pagecate: `${siteidGaName}_k0006`,
    siteid_pagecate_pageid: `${siteidGaName}_k0006_securityConfirm`,
  });
};

const setGa = () => {
  ga(intoPageGaName, {
    siteid: siteidGaName,
    siteid_pagecate: `${siteidGaName}_k0006`,
    siteid_pagecate_pageid: `${siteidGaName}_k0006_securitySecret`,
  });
};

@withResponsive
@withSnackbar()
@connect((state) => {
  const { securtyStatus = {}, user = {} } = state.user;
  const loading = state.loading.effects['account_security/modifyWithdrawPassword'];
  const { isSub = false } = user || {};

  const bizType = securtyStatus.WITHDRAW_PASSWORD
    ? 'UPDATE_WITHDRAWAL_PASSWORD'
    : 'SET_WITHDRAWAL_PASSWORD';
  return {
    securtyStatus: securtyStatus || {},
    user: user || {},
    loading,
    bizType,
    isSub,
  };
})
@requireProps({
  securtyStatus(v) {
    return v && Object.keys(v).length > 0;
  },
})
@injectLocale
class PageDepositProtect extends SecBase {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      modalVisible: true,
      allowTypes: [],
    };

    this.goStep2 = this.next.bind(this, 2);
  }

  next = (nextStep = null) => {
    const n = nextStep || this.state.step + 1;
    if (n > 2) {
      replace('/account/security');
    }
    this.setState({ step: n });
    if (n === 2) {
      setGa();
    }
  };

  componentDidMount() {
    if (this.props.securtyStatus.WITHDRAW_PASSWORD) {
      this.next();
    } else {
      this.getAuthType(this.props.bizType);
      authGa();
    }
  }

  handleSubmit = (err, values) => {
    const { dispatch, message } = this.props;
    const { password, passwordo = null } = values;
    const self = this;
    dispatch({
      type: 'account_security/modifyWithdrawPassword',
      payload: {
        password,
        passwordo: passwordo || null,
      },
    }).then(
      async (res) => {
        if (res && res.code === '200') {
          // 设置成功后重新拉取
          await dispatch({
            type: 'user/pullUser',
          });
          message.success(_t('operation.succeed'));
          self.next(3);
        }
      },
      (error) => {
        if (error && error.code === '40006') {
          self.next(3);
        }
        // message.error(error.msg);
      },
    );
  };

  render() {
    const { securtyStatus, loading, bizType, responsive, isSub = false } = this.props;
    const { step, allowTypes, modalVisible } = this.state;
    const titleText = securtyStatus.WITHDRAW_PASSWORD
      ? _t('trade.code.modify')
      : _t('set.trade.code');

    const isH5 = !responsive.sm;
    const { SMS = false, GOOGLE2FA = false } = securtyStatus;
    // 如果二次验证没有设置，那么根据用户的注册方式来进行验证，
    // 即邮箱登录则邮箱验证，短信登录则短信验证，两者都有，则以短信验证

    const swicthAble = SMS && GOOGLE2FA;

    // const bizType = securtyStatus.WITHDRAW_PASSWORD ?
    //   'UPDATE_WITHDRAWAL_PASSWORD' : 'SET_WITHDRAWAL_PASSWORD';

    const SetPwd = (
      <DepositPasswordForm.SetForm loading={loading} onSubmit={this.handleSubmit} isSub={isSub} />
    );
    const UpdateForm = (
      <DepositPasswordForm.UpdateForm
        isUpdate
        loading={loading}
        onSubmit={this.handleSubmit}
        isSub={isSub}
      />
    );

    return (
      <AccountSecurityProtect data-inspector="account_security_protect">
        {step === 1 && (
          <Wrapper>
            <SecurityVerifyModal visible={true}>
              <SecurityAuthFormV2
                showTitle={false}
                type={bizType}
                allowTypes={allowTypes}
                switchAble={swicthAble}
                bizType={bizType}
                onSuccess={this.next}
              />
            </SecurityVerifyModal>
          </Wrapper>
        )}
        {step === 2 && (
          <Wrapper>
            <Back />
            <Box style={{ height: isH5 ? '24px' : '52px' }} />
            <StyledTitle>{titleText}</StyledTitle>
            {securtyStatus.WITHDRAW_PASSWORD ? UpdateForm : SetPwd}
            <TradePasswordNoticeModal
              visible={modalVisible}
              onClose={() => {
                this.setState({ modalVisible: false });
              }}
            />
          </Wrapper>
        )}
      </AccountSecurityProtect>
    );
  }
}

export default PageDepositProtect;
