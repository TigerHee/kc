/**
 * Owner: willen@kupotech.com
 */
import { getCurrentLang } from 'kc-next/boot';
import { Alert, Box, Form } from '@kux/mui';
import Authentication from 'components/Authentication';
import CommonSecurity from 'components/NewCommonSecurity';
import { message } from 'components/Toast';
import statelessLifeCycle from 'hocs/statelessLifeCycle';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import { getIsInApp } from 'src/helper';
import { _t } from '@/tools/i18n';
import { replace } from 'utils/router';
import Finish from './Finish';
import styledStyles from './styled.module.scss';
import styles from './index.module.scss';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const { useForm } = Form;

const ApplyUnfreeze = (props) => {
  const { frozenTime, securityAllowTypes, dispatch, verifyStep } = props;
  const [form] = useForm();
  const rs = useResponsiveSSR();
  const isH5 = !rs?.sm;

  const isInApp = getIsInApp();
  const currentLang = getCurrentLang();

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
    <div className={styles.containerWrapper} key="form">
      <SecurityVerifyModal visible={verifyStep === 0}>
        <div className={styledStyles.securityForm}>
          <Form form={form}>
            <CommonSecurity
              bizType="UNFROZEN_ACCOUNT"
              form={form}
              allowTypes={securityAllowTypes}
              callback={securityCallBack}
            />
          </Form>
        </div>
      </SecurityVerifyModal>
    </div>,
    <Authentication namespace="account_freeze" onSubmit={handleAuthenticationSubmit} key="auth" />,
    <Finish key="finish" />,
  ];

  const Verify = verifyComponent[verifyStep];

  if (verifyStep === 0) {
    return Verify;
  }

  return (
    <div
      className={styles.containerWrapper}
      style={{ maxWidth: '860px' }}
      data-inspector="account_security_forget"
    >
      <Back
        onClick={() => {
          replace('/account/security');
        }}
      />
      <Box style={{ height: isH5 ? '24px' : '52px' }} />
      {!isInApp && verifyStep === 1 && (
        <h1 className={styles.styledTitle}>{_t('c95bb2af512c4000a759')}</h1>
      )}
      {verifyStep !== 2 && (
        <Alert
          className={styles.styledAlert}
          type="warning"
          showIcon
          description={
            <div className={styledStyles.alertContent}>
              <span>{_t('security.24h.limit')}</span>
              <span>{_t('security.auth.notkyc')}</span>
            </div>
          }
        />
      )}
      <Box style={{ height: '44px' }} />
      {Verify}
    </div>
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
})(ApplyUnfreezeLifeCycle);
