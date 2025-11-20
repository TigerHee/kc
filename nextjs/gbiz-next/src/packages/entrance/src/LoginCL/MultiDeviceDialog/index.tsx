/**
 * Owner: sean.shi@kupotech.com
 */
import { Dialog, Box } from '@kux/mui';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import { useEffect, useState } from 'react';
import { kcsensorsManualTrack } from 'tools/sensors';
import { debounce } from 'lodash';
import { useToast } from '../../hookTool';
import { useLoginStore } from '../../Login/model';
import styles from './index.module.scss';
import { useRouter } from 'kc-next/compat/router';

// 自动登录倒计时长
const duration = 5 * 1000;

let timer: any = null;

interface MultiDeviceDialogProps {
  withDrawer?: boolean;
  onCloseDrawer?: () => void;
  onLoginSuccess?: (data: any) => void;
}

const MultiDeviceDialog: React.FC<MultiDeviceDialogProps> = ({ withDrawer, onCloseDrawer, onLoginSuccess }) => {
  const toast = useToast();
  const router = useRouter();
  const { t: _t } = useTranslation('entrance');

  // zustand store
  const multiDeviceLoginParams = useLoginStore(s => s.multiDeviceLoginParams);
  const token = useLoginStore(s => s.token);
  const submitLoading = useLoginStore(s => s.submitLoading);
  const update = useLoginStore(s => s.update);
  const loginKickOut = useLoginStore(s => s.loginKickOut);

  const [countdown, setCountdown] = useState(0);

  const handleCancel = async () => {
    update?.({
      multiDeviceLoginParams: {
        ...multiDeviceLoginParams!,
        dialogVisible: false,
      },
    });
    if (withDrawer) {
      // 抽屉取消，则直接关闭登录抽屉
      onCloseDrawer?.();
    } else {
      // 页面取消，则回到首页
      router?.push(addLangToPath('/'));
    }
  };

  const handleOk = debounce(async () => {
    const payload =
      multiDeviceLoginParams?.trustDevice !== null
        ? { token, trustDevice: multiDeviceLoginParams?.trustDevice }
        : { token };
    // 如果没有二次验证，不传trustDevice
    const { success, msg, data } = await loginKickOut!({ payload });
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
          clearInterval(timer);
          handleOk();
          return 0;
        });
      }, 1000);
    }
    return () => {
      const beforeValue = multiDeviceLoginParams?.dialogVisible;
      if (beforeValue) {
        timer && clearInterval(timer);
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
        timer && clearInterval(timer);
        setCountdown(0);
        handleOk();
      }}
      okButtonProps={{
        loading: submitLoading,
      }}
    >
      <Box className={styles.content}>
        <p>{_t('rkBEUuwAzm2w4bqGb85Ue5')}</p>
        <p>{_t('9LkfQQMa2EA4yo2R1TZJde')}</p>
      </Box>
    </Dialog>
  );
};
export default MultiDeviceDialog;
