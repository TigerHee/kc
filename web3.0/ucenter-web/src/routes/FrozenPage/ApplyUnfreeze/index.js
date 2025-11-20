/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Alert, Box, Form, styled, useResponsive } from '@kux/mui';
import Authentication from 'components/Authentication';
import CommonSecurity from 'components/NewCommonSecurity';
import { message } from 'components/Toast';
import statelessLifeCycle from 'hocs/statelessLifeCycle';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import { getIsInApp } from 'src/helper';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';
import Finish from './Finish';
import { AlertContent, SecurityForm } from './styled';

const StyledAlert = styled(Alert)`
  .KuxAlert-description {
    margin: 0;
  }
`;

export const ContainerWrapper = styled.div`
  max-width: 580px;
  margin: 26px auto 88px;
  height: auto;
  min-height: calc(100vh - 80px);
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 16px 16px 88px 16px;
  }

  [dir='rtl'] & {
    .KuxAlert-icon {
      padding-right: unset;
      padding-left: 8px;
    }
  }
`;

export const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  padding: 0;
  margin: 0 0 16px 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

const { useForm } = Form;

const ApplyUnfreeze = (props) => {
  const { frozenTime, securityAllowTypes, dispatch, verifyStep } = props;
  const [form] = useForm();
  const rs = useResponsive();
  const isH5 = !rs?.sm;

  const isInApp = getIsInApp();

  if (frozenTime == null || frozenTime > 0) {
    replace('/freeze');
    return null;
  }

  const securityCallBack = (result) => {
    const { success, msg } = result;
    if (success) {
      dispatch({
        type: 'account_freeze/update',
        payload: {
          verifyStep: verifyStep + 1,
        },
      });
    } else {
      message.error(msg);
    }
  };

  const handleAuthenticationSubmit = () => {
    dispatch({
      type: 'account_freeze/authenticationSubmit',
    });
  };

  const verifyComponent = [
    <ContainerWrapper key="form">
      <SecurityVerifyModal visible={verifyStep === 0}>
        <SecurityForm>
          <Form form={form}>
            <CommonSecurity
              bizType="UNFROZEN_ACCOUNT"
              form={form}
              allowTypes={securityAllowTypes}
              callback={securityCallBack}
            />
          </Form>
        </SecurityForm>
      </SecurityVerifyModal>
    </ContainerWrapper>,
    <Authentication namespace="account_freeze" onSubmit={handleAuthenticationSubmit} key="auth" />,
    <Finish key="finish" />,
  ];

  const Verify = verifyComponent[verifyStep];

  if (verifyStep === 0) {
    return Verify;
  }

  return (
    <ContainerWrapper style={{ maxWidth: '860px' }} data-inspector="account_security_forget">
      <Back
        onClick={() => {
          replace('/account/security');
        }}
      />
      <Box style={{ height: isH5 ? '24px' : '52px' }} />
      {!isInApp && verifyStep === 1 && <StyledTitle>{_t('c95bb2af512c4000a759')}</StyledTitle>}
      {verifyStep !== 2 && (
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
      )}
      <Box style={{ height: '44px' }} />
      {Verify}
    </ContainerWrapper>
  );
};

const handleMounted = (props) => {
  const { dispatch } = props;
  dispatch({
    type: 'account_freeze/getSecurityAllowTypes',
  });
  dispatch({
    type: 'account_freeze/getKycCode',
  });
};

// const ApplyUnfreezeWithForm = Form.create()(ApplyUnfreeze);
const ApplyUnfreezeWithForm = ApplyUnfreeze;
const ApplyUnfreezeLifeCycle = statelessLifeCycle({
  handleMounted,
})(ApplyUnfreezeWithForm);

export default connect((state) => {
  const { securityAllowTypes = [], verifyStep, frozenTime } = state.account_freeze || {};
  return {
    securityAllowTypes,
    verifyStep,
    frozenTime,
  };
})(injectLocale(ApplyUnfreezeLifeCycle));
