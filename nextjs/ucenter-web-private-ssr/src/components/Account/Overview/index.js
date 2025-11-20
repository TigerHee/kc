/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';
import { Spin } from '@kux/mui';
import { useMultiSiteConfig } from 'gbiz-next/hooks';
import { styled } from '@kux/mui';
import BeginnerDialog from 'components/Account/Overview/BeginnerDialog';
import SetPasswordDialog from 'components/Account/Overview/SetPasswordDialog';
import UserPromptDialog from 'components/Account/Overview/UserPromptDialog';
import useUserPrompt from 'hooks/useUserPrompt';
import { useSelector } from 'react-redux';
import { useCompliantShowWithInit } from 'src/components/common/CompliantBox';
import { STORAGE_KEY } from 'utils/constants';
import storage from 'utils/storage';
import OverviewAnnouncements from './Announcements';
import OverviewBalance from './Balance';
import OverviewBanner from './Banner';
import OverviewBaseInfo from './BaseInfo';
import OverviewDownload from './Download';
import ExamineTips from './ExamineTips';
import OverviewGetStarted from './GetStarted';
import OverviewMarket from './Market';
import PasskeyDialog from './PasskeyDialog';
import OverviewVipInfo from './VipInfo';
import { useMemo } from 'react';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

const UpdatePwdTipDialog = loadable(() => import('./UpdatePwdTipDialog'));

const LargeOverviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 64px 48px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 16px 32px;
  }

  .KuxSpin-root {
    width: 100%;
  }
`;
const LargeTopLayout = styled.div`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin: 8px 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 0 24px;
  }
`;
const LargeMainLayout = styled.div`
  display: flex;
  flex: 1;
  margin-top: 32px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: block;
    margin-top: 40px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 16px;
  }
`;
const LargeMainLeftLayout = styled.div`
  flex: 1;
  margin-right: 64px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
`;
const LargeMainRightLayout = styled.div`
  width: 460px;
  transition: all 0.3s ease;
  @media screen and (max-width: 1680px) {
    width: 404px;
  }
  ${({ theme }) => theme.breakpoints.down('xl')} {
    width: 360px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: unset;
  }
`;

const Overview = () => {
  // 是否存在登陆密码 默认是存在
  const { existLoginPsd = true } = useSelector((state) => state.user.user) || {};
  const setPasswordDialogVisible =
    !existLoginPsd && !!storage.getItem(STORAGE_KEY.thirdPartySimpleSignup);
  const [prompt, closePrompt] = useUserPrompt([['TOTAL_ASSETS', 3]]); // 用户提示文案

  const { multiSiteConfig } = useMultiSiteConfig();
  const { overviewConfig } = multiSiteConfig?.myConfig || {};

  const { show: newUserBenefit, init: compliantInit } = useCompliantShowWithInit(
    'compliance.account.newUserBenefit.1',
  );
  const { show: vipRate } = useCompliantShowWithInit('compliance.account.vipRate.1');
  const { show: rightBanner } = useCompliantShowWithInit('compliance.account.rightBanner.1');
  const { show: rightAnnouncements } = useCompliantShowWithInit(
    'compliance.account.rightAnnouncements.1',
  );

  const init = useMemo(() => {
    if (compliantInit && multiSiteConfig) {
      return true;
    }

    return false;
  }, [compliantInit, multiSiteConfig]);

  return (
    <>
      <ErrorBoundary scene={SCENE_MAP.account.examineTips}>
        <ExamineTips />
      </ErrorBoundary>
      <LargeOverviewWrapper data-inspector="account_overview_page">
        <Spin type="brand" size="small" spinning={!init}>
          <ErrorBoundary scene={SCENE_MAP.account.baseInfo}>
            {(!init || overviewConfig?.supportMyInfo) && (
              <LargeTopLayout data-inspector="account_overview_base_info">
                <OverviewBaseInfo />
              </LargeTopLayout>
            )}
          </ErrorBoundary>

          <LargeMainLayout>
            <LargeMainLeftLayout>
              <ErrorBoundary scene={SCENE_MAP.account.getStarted}>
                {(!init || (overviewConfig?.supportNewUserBenefits && newUserBenefit)) && (
                  <OverviewGetStarted />
                )}
              </ErrorBoundary>
              <ErrorBoundary scene={SCENE_MAP.account.balance}>
                <OverviewBalance />
              </ErrorBoundary>
              <ErrorBoundary scene={SCENE_MAP.account.market}>
                {(!init || overviewConfig?.supportList) && <OverviewMarket init={init} />}
              </ErrorBoundary>
            </LargeMainLeftLayout>
            <LargeMainRightLayout>
              <ErrorBoundary scene={SCENE_MAP.account.vipInfo}>
                {(!init || (overviewConfig?.supportVipRate && vipRate)) && <OverviewVipInfo />}
              </ErrorBoundary>
              <ErrorBoundary scene={SCENE_MAP.account.banner}>
                {(!init || (overviewConfig?.supportActivityEntry && rightBanner)) && <OverviewBanner />}
              </ErrorBoundary>
              <ErrorBoundary scene={SCENE_MAP.account.announcement}>
                {(!init || (overviewConfig?.supportNotice && rightAnnouncements)) && (
                  <OverviewAnnouncements />
                )}
              </ErrorBoundary>
              <ErrorBoundary scene={SCENE_MAP.account.download}>
                {(!init || overviewConfig?.supportDownloadGuide) && <OverviewDownload />}
              </ErrorBoundary>
            </LargeMainRightLayout>
          </LargeMainLayout>
          {/* 如果有设置密码弹窗，则不弹出其他弹窗 */}
          {setPasswordDialogVisible ? (
            <ErrorBoundary scene={SCENE_MAP.account.setPasswordDialog}>
              <SetPasswordDialog />
            </ErrorBoundary>
          ) : (
            <>
              <ErrorBoundary scene={SCENE_MAP.account.setPasswordDialog}>
                {/* 新注册用户引导弹窗 */}
                <BeginnerDialog />
              </ErrorBoundary>
              <ErrorBoundary scene={SCENE_MAP.account.userPromptDialog}>
                {/* 总资产口径调整 用户提示弹窗 */}
                <UserPromptDialog
                  prompt={prompt['TOTAL_ASSETS']}
                  onOk={() => closePrompt('TOTAL_ASSETS')}
                />
              </ErrorBoundary>
              <ErrorBoundary scene={SCENE_MAP.account.passkeyDialog}>
                {/* passkey 引导弹窗 */}
                <PasskeyDialog />
              </ErrorBoundary>
              <ErrorBoundary scene={SCENE_MAP.account.updatePwdTipDialog}>
                <UpdatePwdTipDialog />
              </ErrorBoundary>
            </>
          )}
        </Spin>
      </LargeOverviewWrapper>
    </>
  );
};
export default Overview;
