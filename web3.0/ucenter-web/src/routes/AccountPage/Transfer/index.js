/**
 * Owner: eli@kupotech.com
 */
import styled from '@emotion/styled';
import JsBridge from '@knb/native-bridge';
import { Spin } from '@kux/mui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as serv from 'services/user_transfer';
import UpgradeModal from 'src/components/UpgradeModal';
import { compareVersion } from 'src/helper';
import { useSelector } from 'src/hooks/useSelector';
import { addLangToPath, _t } from 'src/tools/i18n';
import sessionStorage from 'utils/sessionStorage';
import siteConfig from 'utils/siteConfig';
import AppCustomHeader from './components/AppCustomHeader';
import FAQ from './components/FAQ';
import OneClickProcess from './components/OneClickProcess';
import RemoteFail from './components/Status/Fail';
import Migrating from './components/Status/Migrating';
import RegionRestriction from './components/Status/Restriction';
import RemoteSuccess from './components/Status/Success';
import { StepEnum } from './constants';
import TransferEntry from './Entry';
import { hideAppHeader, resetAppHeader } from './utils/app';
import { useMessageErr } from './utils/message';
import { polling } from './utils/polling';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.overlay};
  padding-bottom: 20px;
  /* padding-top: ${({ isApp }) => (isApp ? '56px' : '0px')}; */
  min-height: calc(100vh - 72px);
`;

const DialogDes = styled.div`
  font-size: 12px;
`;

const LinkToSupport = styled.div`
  padding-bottom: 24px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const namespace = 'userTransfer';

const NEED_UPGRADE_VERSION = '4.1.0';

const { KUCOIN_HOST } = siteConfig;

const UserTransferPage = () => {
  const curStep = useRef(StepEnum.Entry);
  const { appVersion } = useSelector((state) => state.app);
  // const curPollEnd = useRef(null);
  const isApp = JsBridge.isApp();
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const loading = useSelector((state) => {
    return state.loading.effects[`${namespace}/getUserTransferInfo`];
  });

  const [needUpgrade, setNeedUpgrade] = useState(false);

  const [step, setStep] = useState(StepEnum.Entry);

  const errorMessage = useMessageErr();

  const onStepChange = useCallback((value) => {
    curStep.current = value;
    setStep(value);
  }, []);

  const dispatch = useDispatch();

  const isLoading = loading || !userTransferInfo;

  const onConfirm = () => {
    onStepChange(StepEnum.Transfer);
  };

  /* 返回上一步 */
  const onBack = () => {
    if (step === StepEnum.Transfer) {
      onStepChange(StepEnum.Entry);
      return;
    }
    // const steps = [StepEnum.Process, StepEnum.Success, StepEnum.Failed];
    // if (steps.includes(step)) {
    //   return onStepChange(StepEnum.Transfer);
    // }
  };

  const retry = () => {
    sessionStorage.setItem('ucenter_web_transfer_retry', true);
    onStepChange(StepEnum.Entry);
  };

  const checkAppVersion = () => {
    if (isApp && appVersion && compareVersion(appVersion, NEED_UPGRADE_VERSION) < 0) {
      setNeedUpgrade(true);
    }
  };

  const StepContent = useMemo(() => {
    // 切换页面时，滚动条回到头部
    try {
      window.scrollTo?.(0, 0);
    } catch (error) {
      console.error('error scrollTo:', error);
    }
    switch (step) {
      case StepEnum.Blocking:
        return <RegionRestriction />;
      case StepEnum.Entry:
        return <TransferEntry onConfirm={onConfirm} />;
      case StepEnum.Transfer:
        return <OneClickProcess onBack={onBack} />;
      case StepEnum.Process:
        return <Migrating onBack={onBack} />;
      case StepEnum.Success:
        return <RemoteSuccess />;
      case StepEnum.Failed:
        return <RemoteFail retry={retry} />;
      default:
        return null;
    }
  }, [step]);

  /**
   * 首次检查用户登入页面
   */
  const checkIsBlocking = async () => {
    /**
     * 由于canTransfer迁移状态是会在迁移中,迁移成功的时候变为false，导致展示拦截页了 (预期是展示中间页和结果页)
     * 此处需要判断，当canTransfer=false时，看最近一次迁移状态的值来判断跳转的方向
     */
    if (userTransferInfo?.canTransfer === false) {
      // 需要结合最近一次迁移记录来判断跳转页
      let isSuccess = false;
      let isTransferring = false;
      try {
        const { data, success } = await serv.pullTransferStatus();
        if (success && data) {
          const { transferStatus, status } = data;
          isSuccess = transferStatus === 'FINISH' && status === 'SUCCESS';
          isTransferring = transferStatus === 'TRANSFERRING';
        }
      } catch (error) {
        console.error('show checkIsBlocking error:', error);
      }

      if (isSuccess) {
        onStepChange(StepEnum.Success);
      } else if (isTransferring) {
        onStepChange(StepEnum.Process);
      } else {
        onStepChange(StepEnum.Blocking);
      }
    } else {
      onStepChange(StepEnum.Entry);
    }
  };

  useEffect(() => {
    hideAppHeader();
    dispatch({ type: `${namespace}/getUserTransferInfo` });
    dispatch({ type: `${namespace}/pullSymbols` });
    checkAppVersion();

    // 禁止安卓物理按键 & iOS 手势退出
    const forbidReturn = () => {
      return curStep.current === StepEnum.Process;
    };

    // 迁移中不允许返回
    if (isApp) {
      JsBridge.listenNativeEvent.on('onLeftClick', forbidReturn);
    }
    const handleVisible = () => {
      if (document.visibilityState === 'visible') {
        hideAppHeader();
      }
    };

    window.addEventListener('visibilitychange', handleVisible);

    return () => {
      resetAppHeader();
      window.removeEventListener('visibilitychange', handleVisible);
      JsBridge.listenNativeEvent.off('onLeftClick', forbidReturn);
    };
  }, []);

  useEffect(() => {
    let end;
    checkIsBlocking();
    if (!userTransferInfo) {
      return;
    }
    const targetSite = userTransferInfo.targetSiteType;

    end = polling(async () => {
      try {
        const retrying = sessionStorage.getItem('ucenter_web_transfer_retry');
        // 如果处于重新迁移状态，则不以后端状态为准
        if (retrying) return;

        const { data, success } = await serv.pullTransferStatus(targetSite);
        if (success && data) {
          const { transferStatus, status } = data;

          dispatch({
            type: `${namespace}/setUserTransferStatus`,
            payload: {
              data,
            },
          });
          if (transferStatus === 'TRANSFERRING') {
            onStepChange(StepEnum.Process);
          } else if (transferStatus === 'FINISH') {
            /**
             * fail、rollback、success → FINISH
             */
            if (status === 'SUCCESS') {
              /**
               * App侧逻辑: 当前状态是 TRANSFERRING，且后端返回成功状态的数据，同时还是未读状态的情况下，
               * 打开站点迁移页。
               *
               * kill掉App重新打开，同时是迁移成功但未读的情况下，app会优先切换站点，然后再打开该页面，
               * 此时不用再打开App站点迁移页纸需要显示成功页面即可
               */
              if (isApp && curStep.current === StepEnum.Process) {
                JsBridge.open({
                  type: 'func',
                  params: {
                    name: 'startChangeSite',
                    siteType: targetSite,
                  },
                });
              }
              setTimeout(() => {
                onStepChange(StepEnum.Success);
              }, 0);
            } else {
              onStepChange(StepEnum.Failed);
            }
          } else if (
            transferStatus === 'NOT_EXIT' &&
            ![StepEnum.Process, StepEnum.Transfer].includes(curStep.current)
          ) {
            onStepChange(StepEnum.Entry);
          }
        }
      } catch (error) {
        errorMessage(error);
      }
    });
    // curPollEnd.current = end;

    return () => {
      end?.();
    };
  }, [userTransferInfo?.canTransfer]);

  const handleClick = useCallback(() => {
    if (isApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${KUCOIN_HOST}${addLangToPath('/support')}`,
        },
      });
    }
  }, []);

  return (
    <Container isApp={isApp} data-inspector="account_transfer_container">
      <AppCustomHeader title={_t('34b9def8544a4800a99b')} step={step} onBack={onBack} />
      <Spin type="brand" size="basic" spinning={isLoading}>
        {StepContent}
      </Spin>
      {needUpgrade && (
        <UpgradeModal
          content={
            <>
              <DialogDes>{_t('5f55c0b6ac034800a35e')}</DialogDes>
              <LinkToSupport onClick={handleClick}>{`${KUCOIN_HOST}/support`}</LinkToSupport>
            </>
          }
        />
      )}
      <FAQ />
    </Container>
  );
};

export default UserTransferPage;
