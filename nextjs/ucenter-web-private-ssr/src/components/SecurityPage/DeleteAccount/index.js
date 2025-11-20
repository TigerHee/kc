/**
 * Owner: borden@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { Box, styled } from '@kux/mui';
import React, { memo, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Back from 'src/components/common/Back';
import { useSelector } from 'src/hooks/useSelector';
import { exit, logoutAppWithoutSwitchSite } from 'src/utils/runInApp';
import { _t } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import { bizType, StepComps } from './config';
import SuccessPage from './Success';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

export const ContainerWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 80px);
  background: ${(props) => props.theme.colors.overlay};
  transition: padding 0.3s;
  [dir='rtl'] & {
    .KuxAlert-icon {
      padding-right: unset;
      padding-left: 8px;
    }
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 580px;
  margin: 26px auto 88px auto;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 16px 88px 16px;
  }
`;

export const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  margin-bottom: 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 4px;
    font-size: 24px;
  }
`;

export const Context = React.createContext(null);
export default memo(() => {
  useLocale();
  const dispatch = useDispatch();
  const rs = useResponsiveSSR();
  const isH5 = !rs?.sm;
  const isInApp = JsBridge.isApp();
  const { securtyStatus, user = {} } = useSelector((state) => state.user);

  const { WITHDRAW_PASSWORD, SMS, GOOGLE2FA } = securtyStatus || {};
  const verifyOpen = SMS || GOOGLE2FA;
  const withdrawOpen = WITHDRAW_PASSWORD;
  const noSecurityItem = !verifyOpen || !withdrawOpen;

  // 显示校验交易密码的界面
  const [allowTypes, updateAllowTypes] = useState([]);
  // 步骤
  const [step, setStep] = useState('notice');
  // 注销理由
  const [reason, setReason] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const changeStep = useCallback((nextStep) => {
    setStep(nextStep);
    window.scrollTo(0, 0);
  }, []);

  const clickBack = useCallback(() => {
    if (step === 'security') {
      changeStep('reason');
    } else {
      if (isInApp) {
        exit();
      } else {
        window.history.go(-1);
      }
    }
  }, [changeStep, isInApp, step]);

  const checkSecurity = useCallback(async () => {
    // 加载校验类型
    const nextAllowTypes = await dispatch({
      type: 'security_new/get_verify_type',
      payload: { bizType },
    });
    updateAllowTypes(nextAllowTypes);
    if (!noSecurityItem) saTrackForBiz({}, ['FourStepDeleteAccount', '1']);
    changeStep('security');
  }, [noSecurityItem]);

  const cancellationAccount = useCallback(() => {
    dispatch({
      type: 'security_new/cancellationAccount',
      payload: reason,
    })
      .then(async (res) => {
        if (res.success) {
          if (JsBridge.isApp()) {
            // 在 App 中，退出登录，不切换站点
            await logoutAppWithoutSwitchSite();
          }
          setIsFinished(true);
        } else {
          changeStep('reason');
        }
      })
      .catch(() => {
        changeStep('reason');
      });
  }, [reason]);

  const StepComp = StepComps[step] || StepComps.notice;

  if (isFinished) {
    return <SuccessPage />;
  }

  if (!noSecurityItem && step === 'security') {
    return (
      <Context.Provider value={{ changeStep, checkSecurity, setReason, reason }}>
        <StepComp
          allowTypes={allowTypes}
          noSecurityItem={!verifyOpen || !withdrawOpen}
          onSuccess={() => {
            trackClick(['FourStepDeleteAccount', '1']);
            trackClick(['Verify', 'Confirm'], { Result: 'Success' });
            cancellationAccount();
          }}
          onError={(e) => {
            trackClick(['Verify', 'Confirm'], { Result: 'False' });
            if (['40006', '40001'].includes(e?.code)) {
              changeStep('reason');
            }
          }}
        />
      </Context.Provider>
    );
  }

  return (
    <ContainerWrapper data-inspector="account_security_delete">
      <ContentWrapper>
        <Back onClick={clickBack} />
        <Box style={{ height: isH5 ? '24px' : '52px' }} />
        {step !== 'accountInfo' && <Title>{_t('account.del.title')}</Title>}
        <Context.Provider value={{ changeStep, checkSecurity, setReason, reason }}>
          <StepComp
            allowTypes={allowTypes}
            noSecurityItem={!verifyOpen || !withdrawOpen}
            onSuccess={() => {
              trackClick(['FourStepDeleteAccount', '1']);
              cancellationAccount();
            }}
            onError={(e) => {
              if (['40006', '40001'].includes(e?.code)) {
                changeStep('reason');
              }
            }}
          />
        </Context.Provider>
      </ContentWrapper>
    </ContainerWrapper>
  );
});
