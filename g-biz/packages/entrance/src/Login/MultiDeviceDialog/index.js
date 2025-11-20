/**
 * Owner: willen@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { useDispatch, useSelector } from 'react-redux';
import addLangToPath from '@tools/addLangToPath';
import { useEffect, useState } from 'react';
import { kcsensorsManualTrack, getTrackingSource } from '@utils/sensors';
import { debounce } from 'lodash';
import { NAMESPACE } from '../constants';
import { push } from '../../../utils/router';
import { useToast } from '../../hookTool';

const Content = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  p {
    margin-bottom: 0;
  }
`;

// 自动登录倒计时长
const duration = 5 * 1000;

let timer = null;

const MultiDeviceDialog = ({ withDrawer, onCloseDrawer, onLoginSuccess, trackingConfig }) => {
  const toast = useToast();
  const {
    t: _t,
    i18n: { language },
  } = useTranslation('entrance');
  const dispatch = useDispatch();
  const multiDeviceLoginParams = useSelector((s) => s[NAMESPACE].multiDeviceLoginParams);
  const token = useSelector((state) => state[NAMESPACE].token);
  const submitLoading = useSelector((s) => s.loading.effects[`${NAMESPACE}/loginKickOut`]);
  const [countdown, setCountdown] = useState(0);

  const handleCancel = async () => {
    await dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        multiDeviceLoginParams: {
          ...multiDeviceLoginParams,
          dialogVisible: false,
        },
      },
    });
    if (withDrawer) {
      // 抽屉取消，则直接关闭登录抽屉
      onCloseDrawer?.();
    } else {
      // 页面取消，则回到首页
      push(addLangToPath('/', language));
    }
  };

  const handleOk = debounce(async () => {
    const payload =
      multiDeviceLoginParams.trustDevice !== null
        ? { token, trustDevice: multiDeviceLoginParams.trustDevice }
        : { token };
    // 如果没有二次验证，不传trustDevice
    const source = getTrackingSource(trackingConfig);
    const { success, msg, data } = await dispatch({
      type: `${NAMESPACE}/loginKickOut`,
      trackResultParams: { source },
      payload,
    });
    if (success) {
      if (withDrawer) onCloseDrawer?.();
      onLoginSuccess(data);
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
        setCountdown((i) => {
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

  return (
    <Dialog
      container={withDrawer ? document.body : document.querySelector('#loginFormContainer')}
      title={_t('gaWyKy4Gx1YuFuNEeaPLy4')}
      open={multiDeviceLoginParams?.dialogVisible}
      cancelText={_t('d3wXBNWMdSxa98TkKSvxQL')}
      okText={
        countdown && !submitLoading
          ? _t('iAgnRYeVM9jN4Wbz5FcFAf', { number: countdown })
          : _t('naKMRUbdEdM4ABkiwvbsRq')
      }
      showCloseX={false}
      centeredFooterButton
      onCancel={() => {
        kcsensorsManualTrack(
          {
            spm: ['loginConfirmPopup', '2'],
            data: { businessType: 'login_tickout' },
          },
          'page_click',
        );
        handleCancel();
      }}
      onOk={() => {
        kcsensorsManualTrack(
          {
            spm: ['loginConfirmPopup', '1'],
            data: { businessType: 'login_tickout' },
          },
          'page_click',
        );
        timer && clearInterval(timer);
        setCountdown(0);
        handleOk();
      }}
      okButtonProps={{
        loading: submitLoading,
      }}
    >
      <Content>
        <p>{_t('rkBEUuwAzm2w4bqGb85Ue5')}</p>
        <p>{_t('9LkfQQMa2EA4yo2R1TZJde')}</p>
      </Content>
    </Dialog>
  );
};
export default MultiDeviceDialog;
