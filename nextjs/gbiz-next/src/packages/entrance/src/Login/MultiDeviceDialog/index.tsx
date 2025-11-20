/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@kux/mui';
import { useRouter } from 'kc-next/compat/router';
import clsx from 'clsx';
import { debounce } from 'lodash-es';
import addLangToPath from 'tools/addLangToPath';
import { kcsensorsManualTrack } from 'tools/sensors';
import { getTrackingSource } from '../../common/tools';
import { useLang, useToast } from '../../hookTool';
import { useLoginStore } from '../model';
import styles from './index.module.scss';

// 自动登录倒计时长
const duration = 5 * 1000;

let timer: NodeJS.Timeout | null = null;

interface MultiDeviceDialogProps {
  withDrawer?: boolean;
  onCloseDrawer?: () => void;
  onLoginSuccess?: (data: any) => void;
  trackingConfig?: any;
}

const MultiDeviceDialog: React.FC<MultiDeviceDialogProps> = ({
  withDrawer,
  onCloseDrawer,
  onLoginSuccess,
  trackingConfig,
}) => {
  const toast = useToast();
  const { t: _t } = useLang();
  const router = useRouter();

  // zustand
  const multiDeviceLoginParams = useLoginStore(state => state.multiDeviceLoginParams)!;
  const token = useLoginStore(state => state.token);
  const submitLoading = useLoginStore(state => state.submitLoading);
  const loginKickOut = useLoginStore(state => state.loginKickOut);
  const update = useLoginStore(state => state.update);

  const [countdown, setCountdown] = useState(0);

  const handleCancel = useCallback(async () => {
    update?.({
      multiDeviceLoginParams: {
        ...multiDeviceLoginParams,
        dialogVisible: false,
      },
    });
    if (withDrawer) {
      onCloseDrawer?.();
    } else {
      router?.push(addLangToPath('/'));
    }
  }, [multiDeviceLoginParams, withDrawer, onCloseDrawer]);

  const handleOk = debounce(async () => {
    const payload =
      multiDeviceLoginParams.trustDevice !== null
        ? { token, trustDevice: multiDeviceLoginParams.trustDevice }
        : { token };
    const source = getTrackingSource(trackingConfig);
    const { success, msg, data } = await loginKickOut!({
      payload,
      trackResultParams: { source },
    });
    if (success) {
      if (withDrawer) onCloseDrawer?.();
      onLoginSuccess?.(data);
    }
    if (msg) {
      toast.error(msg);
    }
  }, 20);

  useEffect(() => {
    if (multiDeviceLoginParams?.dialogVisible) {
      kcsensorsManualTrack({
        spm: ['loginConfirmPopup', '1'],
        data: { businessType: 'login_tickout' },
      });
      setCountdown(duration / 1000);
      timer = setInterval(() => {
        setCountdown(i => {
          const afterV = i - 1;
          if (afterV > 0) {
            return afterV;
          }
          if (timer) clearInterval(timer);
          handleOk();
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (multiDeviceLoginParams?.dialogVisible && timer) {
        clearInterval(timer);
      }
    };
  }, [multiDeviceLoginParams?.dialogVisible]);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Dialog
      container={withDrawer ? document.body : document.querySelector('#loginFormContainer')}
      title={_t('gaWyKy4Gx1YuFuNEeaPLy4')}
      open={multiDeviceLoginParams?.dialogVisible}
      cancelText={_t('d3wXBNWMdSxa98TkKSvxQL')}
      okText={
        countdown && !submitLoading ? _t('iAgnRYeVM9jN4Wbz5FcFAf', { number: countdown }) : _t('naKMRUbdEdM4ABkiwvbsRq')
      }
      showCloseX={false}
      centeredFooterButton
      onCancel={() => {
        kcsensorsManualTrack(
          {
            spm: ['loginConfirmPopup', '2'],
            data: { businessType: 'login_tickout' },
          },
          'page_click'
        );
        handleCancel();
      }}
      onOk={() => {
        kcsensorsManualTrack(
          {
            spm: ['loginConfirmPopup', '1'],
            data: { businessType: 'login_tickout' },
          },
          'page_click'
        );
        if (timer) clearInterval(timer);
        setCountdown(0);
        handleOk();
      }}
      okButtonProps={{
        loading: submitLoading,
      }}
    >
      <div className={clsx(styles.content)}>
        <p>{_t('rkBEUuwAzm2w4bqGb85Ue5')}</p>
        <p>{_t('9LkfQQMa2EA4yo2R1TZJde')}</p>
      </div>
    </Dialog>
  );
};

export default MultiDeviceDialog;
