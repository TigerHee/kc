/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Alert, Box, styled, useResponsive, useSnackbar } from '@kux/mui';
import BindEmailForm from 'components/Account/SecurityForm/BindEmailForm';
import ChangeResult from 'components/Account/SecurityForm/ChangeResult';
import SecurityModule from 'components/Account/SecurityForm/SecurityModule';
import { tenantConfig } from 'config/tenant';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Back from 'src/components/common/Back';
import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import { replace } from 'utils/router';

// --- 样式 start ---
const Wrapper = styled.div`
  max-width: 520px;
  margin: 26px auto 88px auto;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 24px 16px 88px 16px;
  }
  [dir='rtl'] & {
    .KuxAlert-icon {
      padding-right: unset;
      padding-left: 8px;
    }
  }
`;

const AccountSecurityEmail = styled.div`
  .KuxAlert-description {
    margin-top: 0;
  }
`;

const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  padding: 0;
  margin: 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

const AlertContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  line-height: 150%;
`;

// --- 样式 end ---

const configKey = 'emailBindOpt';
const ModifyEmailPage = () => {
  useLocale();
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [step, updateStep] = useState(0);
  const [resultModalProps, updaterResultModalProps] = useState(null);

  const responsive = useResponsive();
  const isH5 = !responsive?.sm;

  const bizType = user?.emailValidate ? 'UPDATE_EMAIL' : 'BIND_EMAIL';

  useEffect(() => {
    if (step === 0) {
      saTrackForBiz({}, ['NextButton', '1']);
    } else {
      saTrackForBiz({}, ['Submit', '1']);
    }
  }, [step]);

  const handleCheckSecuritySuccess = useCallback(() => {
    trackClick(['NextButton', '1']);
    updateStep(1);
  }, []);

  const handleFail = useCallback((err) => {
    trackClick(['Submit', '1']);
    if (err && err.code === '40006') {
      updateStep(0);
    }
  }, []);

  const handleSuccess = useCallback(
    (res) => {
      trackClick(['Submit', '1']);
      const isWarnRisk = res?.data?.riskCode === 'warn';
      const isRejectRisk = res?.data?.riskCode === 'reject';
      if (isWarnRisk || isRejectRisk) {
        // 命中风控
        updaterResultModalProps({
          open: true,
          onOk: () => {
            if (isWarnRisk) {
              const newWindow = window.open('/support');
              if (newWindow) {
                newWindow.opener = null;
              }
            } else {
              updaterResultModalProps(null);
            }
          },
          title: _t('4igBLirWPx4UacVKBbuk2D'),
          ...(!isWarnRisk ? { cancelText: null } : {}),
          titleForDialog: false,
          iconType: isWarnRisk ? 'warning' : 'error',
          onCancel: () => updaterResultModalProps(null),
          content: isWarnRisk
            ? _t('wUbFa38LambZqRQmMZ8xkw')
            : isRejectRisk
            ? _t('eZYCqSzfopWN2g6KoBjM8G')
            : null,
          okText: isWarnRisk ? _t('e2gTG6rHS35mvQuKFA3cHJ') : _t('poolx.ac.modal.cancel'),
        });
        return;
      }
      window.history.length > 1 ? window.history.go(-1) : replace('/account/security');
      message.success(user?.emailValidate ? _t('m8ynkPYombBvH55s6nYyWu') : _t('operation.succeed'));
    },
    [user],
  );

  const stepComps = [
    () => (
      <Wrapper>
        <SecurityVerifyModal
          visible={step === 0}
          showTopTip={true}
          topTip={tenantConfig.account.topTip(_t)}
        >
          <SecurityModule
            bizType={bizType}
            onSuccess={handleCheckSecuritySuccess}
            submitBtnTxt={_t('xiTx5vKPMTgXB5nJ8bSdkP')}
          />
        </SecurityVerifyModal>
      </Wrapper>
    ),
    () => (
      <Wrapper>
        <Back />
        <Box style={{ height: isH5 ? '24px' : '52px' }} />
        <StyledTitle>
          {user?.emailValidate ? _t('pJ2h4eUnRuTzJ8CFM42zPa') : _t('email.bind')}
        </StyledTitle>
        {user?.emailValidate && (
          <>
            <Box style={{ height: '16px' }} />
            <Alert
              type="warning"
              description={
                <AlertContent>
                  <span>
                    1.
                    {tenantConfig.account.topTip(_t)}
                  </span>
                  <span>2.{_t('1DUFyXFrtG1i2v36CK9gJW')}</span>
                </AlertContent>
              }
            />
          </>
        )}
        <Box marginTop={isH5 ? '32px' : '40px'}>
          <BindEmailForm
            showTitle={false}
            bizType={bizType}
            dispatch={dispatch}
            onSuccess={handleSuccess}
            onError={handleFail}
            isUpdate={user?.emailValidate}
          />
        </Box>
      </Wrapper>
    ),
  ];

  return (
    <AccountSecurityEmail data-inspector="account_security_email">
      {stepComps[step]()}
      <ChangeResult vertical {...resultModalProps} />
    </AccountSecurityEmail>
  );
};

export default memo(
  withMultiSiteForbiddenPage(ModifyEmailPage, 'securityConfig', configKey, '/account/security'),
);
