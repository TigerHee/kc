/**
 * Owner: eli.xiang@kupotech.com
 */
import history from '@kucoin-base/history';
import { Dialog, Drawer, styled, useResponsive } from '@kux/mui';
import { useEffect } from 'react';

import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import usePasskeyGuide from 'hooks/usePasskeyGuide';
import { saTrackForBiz, trackClick } from 'utils/ga';
import PasskeyDialogContent from './Content';

const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    max-width: 520px;
    max-height: 640px;
    overflow-y: auto;
    .KuxModalHeader-root {
      height: 0;
      min-height: 0;
      padding-bottom: 0;
    }
    .KuxDialog-content {
      padding-bottom: 32px;
    }
  }
`;

const StyledDrawer = styled(Drawer)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    .KuxModalHeader-root {
      border: 0;
    }
    .KuxDrawer-content {
      padding: 0 16px 20px;
    }
  }
`;

export default function PasskeyDialog() {
  const { showGuide, hiddenPasskeyGuide } = usePasskeyGuide();
  const { multiSiteConfig } = useMultiSiteConfig();
  const supportPasskeyLogin = multiSiteConfig?.securityConfig?.passkeyOpt;
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const handleOk = () => {
    trackClick(['GuidePasskeySuccess', '1']);
    history.push('/account/security/passkey', { callPasskeyRegister: true });
  };

  const handleCancel = () => {
    // trackClick(['GuidePasskeyFail', '1']); // 点击蒙层外部，关闭引导 目前没有点击蒙层关闭弹窗
    trackClick(['GuidePasskeyFail', '2']); // 点击稍后设置，关闭引导
    hiddenPasskeyGuide();
  };

  useEffect(() => {
    if (showGuide) {
      saTrackForBiz({}, ['GuidePasskey', '1']);
    }
  }, [showGuide]);

  return !isH5 ? (
    <StyledDialog
      open={showGuide && supportPasskeyLogin}
      title={null}
      cancelText={null}
      footer={null}
      okText={null}
      showCloseX={false}
    >
      <PasskeyDialogContent onOk={handleOk} onCancel={handleCancel} />
    </StyledDialog>
  ) : (
    <StyledDrawer back={null} show={showGuide} anchor="bottom" onClose={handleCancel}>
      <PasskeyDialogContent onOk={handleOk} onCancel={handleCancel} />
    </StyledDrawer>
  );
}
