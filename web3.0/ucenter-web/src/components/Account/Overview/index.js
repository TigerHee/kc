/**
 * Owner: willen@kupotech.com
 */
import { useCompliaceRedirect } from '@kucoin-biz/compliantCenter';
import { UpdatePwdTipDialog } from '@kucoin-biz/entrance';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { styled, useTheme } from '@kux/mui';
import BeginnerDialog from 'components/Account/Overview/BeginnerDialog';
import SetPasswordDialog from 'components/Account/Overview/SetPasswordDialog';
import UserPromptDialog from 'components/Account/Overview/UserPromptDialog';
import useUserPrompt from 'hooks/useUserPrompt';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CompliantBox from 'src/components/common/CompliantBox';
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
  useCompliaceRedirect();
  // 是否存在登陆密码 默认是存在
  const { existLoginPsd = true } = useSelector((state) => state.user.user) || {};
  const setPasswordDialogVisible =
    !existLoginPsd && !!storage.getItem(STORAGE_KEY.thirdPartySimpleSignup);
  const theme = useTheme();
  const [prompt, closePrompt] = useUserPrompt([['TOTAL_ASSETS', 3]]); // 用户提示文案

  const [isUpdatePwdTipDialogInit, setUpdatePwdTipDialogInit] = useState(true);

  const { multiSiteConfig } = useMultiSiteConfig();
  if (!multiSiteConfig) {
    return null;
  }
  const { overviewConfig } = multiSiteConfig?.myConfig || {};

  return (
    <>
      <ExamineTips />
      <LargeOverviewWrapper data-inspector="account_overview_page">
        {overviewConfig?.supportMyInfo && (
          <LargeTopLayout data-inspector="account_overview_base_info">
            <OverviewBaseInfo />
          </LargeTopLayout>
        )}

        <LargeMainLayout>
          <LargeMainLeftLayout>
            {overviewConfig?.supportNewUserBenefits && (
              <CompliantBox spm="compliance.account.newUserBenefit.1">
                {/* ip 是英国，则不展示入金收益模块 */}
                <OverviewGetStarted />
              </CompliantBox>
            )}
            <OverviewBalance />
            {overviewConfig?.supportList && <OverviewMarket />}
          </LargeMainLeftLayout>
          <LargeMainRightLayout>
            {overviewConfig?.supportVipRate && (
              <CompliantBox spm="compliance.account.vipRate.1">
                {/* ip 是英国，则不展示 vip 信息模块 */}
                <OverviewVipInfo />
              </CompliantBox>
            )}
            {overviewConfig?.supportActivityEntry && (
              <CompliantBox spm="compliance.account.rightBanner.1">
                <OverviewBanner />
              </CompliantBox>
            )}
            {overviewConfig?.supportNotice && (
              <CompliantBox spm="compliance.account.rightAnnouncements.1">
                <OverviewAnnouncements />
              </CompliantBox>
            )}
            {overviewConfig?.supportDownloadGuide && <OverviewDownload />}
          </LargeMainRightLayout>
        </LargeMainLayout>
        {/* 如果有设置密码弹窗，则不弹出其他弹窗 */}
        {setPasswordDialogVisible ? (
          <SetPasswordDialog />
        ) : (
          <>
            {/* 新注册用户引导弹窗 */}
            <BeginnerDialog />
            {/* 总资产口径调整 用户提示弹窗 */}
            <UserPromptDialog
              prompt={prompt['TOTAL_ASSETS']}
              onOk={() => closePrompt('TOTAL_ASSETS')}
            />
            {/* passkey 引导弹窗 */}
            <PasskeyDialog />
            {isUpdatePwdTipDialogInit && (
              <UpdatePwdTipDialog
                theme={theme.currentTheme}
                isInit={isUpdatePwdTipDialogInit}
                onCallback={() => {
                  setUpdatePwdTipDialogInit(false);
                }}
              />
            )}
          </>
        )}
      </LargeOverviewWrapper>
    </>
  );
};
export default Overview;
