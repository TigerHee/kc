/**
 * Owner: john.zhang@kupotech.com
 */

import JsBridge from 'gbiz-next/bridge';
import { Button, Dialog, Drawer, styled } from '@kux/mui';
import { useEffect, useState } from 'react';
import { autoRegisterZBXAccount, getUserZBXAccount } from 'src/services/guidance_zbx';
import { addLangToPath, _t } from '@/tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'src/utils/ga';
import { ZBX_OFFICIAL_LINK } from '../../constants';
import { reportZbxErrorToSentry } from '../../utils';
import DialogContent from './DialogContent';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const ConfirmButton = styled(Button)`
  width: 100%;
`;
const ClaimDialog = styled(Dialog)`
  width: 100%;
  .KuxDialog-body {
    min-width: 640px;
    .KuxModalHeader-root {
      display: flex;
      gap: 24px;
      padding: 32px;
    }

    ${({ theme }) => theme.breakpoints.down('sm')} {
      width: 100%;
      min-width: unset;
    }
  }
`;

const ClaimDrawer = styled(Drawer)`
  width: 100%;
  border-radius: 20px 20px 0 0;
  .KuxDrawer-root {
    max-height: var(100vh - 40px);
  }
  .KuxModalHeader-root {
    display: flex;
    gap: 24px;
    padding: 24px 16px 12px;
    font-weight: 700;
    font-size: 18px;
    font-style: normal;
    line-height: 140%;
    border-bottom: none;
  }
  .KuxModalHeader-close {
    top: 24px;
    width: 24px;
    height: 24px;
  }

  .KuxDrawer-content {
    padding: 0 16px 20px;
  }
`;

const ClaimButton = ({ btnText = '', isRollback = false, isEmailValid = true }) => {
  const [claimLoading, setClaimLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  const isApp = JsBridge.isApp();

  const handleRedirectZBX = (url) => {
    if (!url) {
      console.log('zbx redirect url empty!');
      return;
    }
    // window.location.href = url;
    window.open(url);
    setRedirectUrl(url);
  };

  const handleClaimAccount = async () => {
    try {
      setClaimLoading(true);
      const { data } = await autoRegisterZBXAccount();
      setRedirectUrl(data);
      kcsensorsManualExpose(['automaticRegistrationResults', 'success']);
      return { success: true, data };
    } catch (error) {
      console.error('show handleClaimAccount error:', error);
      kcsensorsManualExpose(['automaticRegistrationResults', 'fail']);
      reportZbxErrorToSentry(
        `zbx error | autoRegisterZBXAccount | ${error?.response?.status} | ${
          error.message || error.msg
        }`,
      );
      return { success: false, data: null };
    } finally {
      setClaimLoading(false);
    }
  };

  const handleRedirectAssets = () => {
    if (isApp) {
      const link = addLangToPath('/account/asset?from=overview');
      JsBridge.open({
        type: 'jump',
        params: {
          url: link,
        },
      });
    } else {
      window.location.href = addLangToPath('/assets');
    }
  };

  const handleRedirectZbx = () => {
    if (isApp) {
      window.location.href = ZBX_OFFICIAL_LINK;
    } else {
      window.open(ZBX_OFFICIAL_LINK);
    }
  };

  const handleButtonClick = async () => {
    if (!isEmailValid) {
      handleRedirectZbx();
      return;
    }

    if (isRollback) {
      handleRedirectAssets();
      trackClick(['enterKCAserts', '1']);
      return;
    }

    if (redirectUrl) {
      trackClick(['enterZBXToView', '1']);
      // 每个跳转url只能访问一次
      const newRedirectUrl = await getZBXAccount();
      handleRedirectZBX(newRedirectUrl);
    } else {
      setClaimLoading(true);
      setOpen(true);
      trackClick(['agreeToAuthorize', '1']);
    }
  };

  // 检查用户是否已经成功注册了zbx账号, 注册成功后，点击申领资产立刻跳转到zbx页面
  const getZBXAccount = async () => {
    try {
      setClaimLoading(true);
      const { data } = await getUserZBXAccount();
      const { redirectUrl } = data || {};
      if (redirectUrl) {
        setRedirectUrl(redirectUrl);
      }
      return redirectUrl;
    } catch (error) {
      console.error('show getZBXAccount error:', error);
      reportZbxErrorToSentry(
        `zbx error | getUserZBXAccount | ${error?.response?.status} | ${
          error.message || error.msg
        }`,
      );
    } finally {
      setClaimLoading(false);
    }
  };

  useEffect(() => {
    getZBXAccount();
  }, []);

  return (
    <>
      <ConfirmButton loading={claimLoading} onClick={handleButtonClick}>
        {btnText || _t('9a75b771cb024000a83c')}
      </ConfirmButton>

      {isH5 || isApp ? (
        <ClaimDrawer
          title={_t('9a75b771cb024000a83c')}
          anchor="bottom"
          show={open}
          back={false}
          onClose={() => {
            setOpen(false);
            setClaimLoading(false);
          }}
        >
          <DialogContent onRegister={handleClaimAccount} />
        </ClaimDrawer>
      ) : (
        <ClaimDialog
          title={_t('9a75b771cb024000a83c')}
          open={open}
          cancelText={undefined}
          okText={undefined}
          onCancel={() => {
            setOpen(false);
            setClaimLoading(false);
          }}
          centeredFooterButton
        >
          <DialogContent onRegister={handleClaimAccount} />
        </ClaimDialog>
      )}
    </>
  );
};

export default ClaimButton;
