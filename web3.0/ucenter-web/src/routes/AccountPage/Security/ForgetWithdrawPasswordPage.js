/**
 * Owner: lori@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Alert, Box, styled, withResponsive, withSnackbar } from '@kux/mui';
import Finish from 'components/Account/SecurityForm/Finish';
import SecurityAuthForm from 'components/Account/SecurityForm/SecurityAuthForm';
import Authentication from 'components/NewAuthentication/WithFace';
import ModalForbid from 'components/Tips/modalForbid';
import UpgradeModal from 'components/UpgradeModal';
import { SUPPORT_BAIDU_FACE } from 'config/base';
import { getIsInApp } from 'helper';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import { _t } from 'tools/i18n';
import compareVersion from 'utils/compareVersion';
import { trackClick } from 'utils/ga';
import { replace } from 'utils/router';
import { FORGET_TRADE_PW_BLOCKIDS } from './config';
import SecBase from './SecPageBase';
import { AlertContent, StyledTitle, WithMinHeight, Wrapper } from './style';

const StyledAlert = styled(Alert)`
  .KuxAlert-description {
    margin: 0;
  }
`;

@withResponsive
@withSnackbar()
@connect((state) => {
  const { securtyStatus = {}, user = {} } = state.user;
  const { appVersion } = state.app;
  const status = state?.forget_withdraw_password?.status;
  const { isSub = false } = user || {};
  const bizType = 'FORGET_WITHDRAWAL_PASSWORD';
  return {
    securtyStatus: securtyStatus || {},
    bizType,
    status,
    isSub,
    appVersion,
  };
})
@injectLocale
export default class PageForgetWP extends SecBase {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      allowTypes: [],
      status: 9,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.status !== prevState.status) {
      return {
        ...prevState,
        status: nextProps.status,
        step: nextProps.status === 0 ? 2 : prevState.step,
      };
    }
    return null;
  }

  componentDidMount() {
    this.getAuthType(this.props.bizType);
    const { dispatch } = this.props;
    dispatch({
      type: 'forget_withdraw_password/resetInfo',
    });
    dispatch({
      type: 'forget_withdraw_password/getKycCode',
    });
  }

  componentWillUnmount() {
    this.reset();
  }

  reset = () => {
    this.props.dispatch({
      type: 'forget_withdraw_password/reset',
    });
  };

  // 第一步安全验证的神策埋点
  sensorsClick = () => {
    const { allowTypes } = this.state;
    const securityBlockId = [...FORGET_TRADE_PW_BLOCKIDS].find((b) =>
      isEqual(b[0], allowTypes),
    )?.[1];
    trackClick([securityBlockId, '1']);
  };

  next = (s) => {
    const { step } = this.state;
    const newStep = step + s >= 2 ? 2 : step + s;
    this.setState({ step: newStep });
  };

  handleSubmit = () => {
    const { dispatch, message } = this.props;
    dispatch({
      type: 'forget_withdraw_password/submit',
    }).then((response) => {
      if (response.success) {
        this.next(1);
      } else {
        message.error(response.msg);
        this.next(-1);
      }
    });
  };

  render() {
    const { securtyStatus, bizType, status, isSub = false, responsive, appVersion } = this.props;

    const isH5 = !responsive?.sm;

    if (status === null) {
      return null;
    }
    const { allowTypes, step } = this.state;
    const isInApp = getIsInApp();

    const titleText = _t('c95bb2af512c4000a759');
    const { SMS = false, GOOGLE2FA = false, WITHDRAW_PASSWORD } = securtyStatus;
    // 没有设置交易密码就返回安全设置页面
    if (WITHDRAW_PASSWORD !== undefined && !WITHDRAW_PASSWORD) {
      replace('/account/security');
    }

    const swicthAble = SMS && GOOGLE2FA;
    const contentMap = {
      0: (
        <Wrapper data-inspector="account_security_forgetWP">
          <SecurityVerifyModal
            showTopTip={false}
            visible={true}
            onCancel={() => replace('/account/security')}
          >
            <SecurityAuthForm
              showTitle={false}
              type={bizType}
              showAlert={true}
              allowTypes={allowTypes}
              switchAble={swicthAble}
              bizType={bizType}
              onSuccess={() => {
                this.sensorsClick();
                this.next(1);
              }}
            />
          </SecurityVerifyModal>
        </Wrapper>
      ),
      1: (
        <>
          <StyledAlert
            type="warning"
            showIcon
            description={
              <AlertContent>
                <span>{_t('security.24h.limit')}</span>
                <span>{_t('security.auth.notkyc')}</span>
              </AlertContent>
            }
          />
          <Box style={{ height: '44px' }} />
          <Authentication
            namespace="forget_withdraw_password"
            onSubmit={this.handleSubmit}
            bizType={bizType}
          />
        </>
      ),
      2: <Finish />,
    };
    // const steps = [
    //   { title: _t('security.verify') },
    //   { title: _t('identity.verify') },
    //   { title: _t('done') },
    // ];

    // app版本过低不支持人脸识别, 提示升级版本
    if (isInApp && appVersion && compareVersion(appVersion, SUPPORT_BAIDU_FACE) < 0) {
      return <UpgradeModal />;
    }

    if (step === 0) {
      return contentMap[0];
    }

    return (
      <Wrapper data-inspector="account_security_forgetWP" style={{ maxWidth: '860px' }}>
        <WithMinHeight data-inspector="account_security_forget">
          <Back
            onClick={() => {
              if (step === 2) {
                replace('/account/security');
              } else {
                window.history.go(-1);
              }
            }}
          />
          <Box style={{ height: isH5 ? '24px' : '52px' }} />
          {isSub && <ModalForbid />}
          {!isInApp && step === 1 && <StyledTitle>{titleText}</StyledTitle>}
          {/* {step !== 2 && (
            <div className={style.stepsContainer}>
              <SecSteps
                currentStep={step}
                steps={steps}
                labelPlacement={responsive.md ? 'horizontal' : 'vertical'}
                size="small"
                direction="horizontal"
              />
            </div>
          )} */}
          {contentMap[step]}
        </WithMinHeight>
      </Wrapper>
    );
  }
}
