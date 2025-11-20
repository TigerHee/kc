import JsBridge from 'gbiz-next/bridge';
import { goVerify } from 'gbiz-next/verification';
import { Empty, Modal, toast } from '@kux/design';
import usePasskey, { PasskeyRegisterStatus } from 'hooks/usePasskey';
import { useEffect, useState } from 'react';
import passkeyVerifyingSrc from 'static/account/security/passkey/passkey-verifying.svg';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { PASSKEY_BIZ_TYPE, PASSKEY_OPERATE_TYPE } from '../constants';
import * as styles from './styles.module.scss';

const IS_IN_APP = JsBridge.isApp();

const RegisterStatus = {
  init: 1,
  success: 2,
  fail: 3,
};

export default function PasskeyAddDialog({ open: originOpen, isFirst, onSuccess, onCancel }) {
  const [status, setStatus] = useState(RegisterStatus.init);
  const { currentPasskeyStatus, loading, passkeyRegister } = usePasskey();
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
    onCancel();
  };

  const createPasskeyInApp = () => {
    setOpen(false);
    try {
      JsBridge.open(
        {
          type: 'func',
          params: {
            name: 'createPasskey',
            bizType: PASSKEY_BIZ_TYPE.BIND_PASSKEY,
            businessData: JSON.stringify({
              operateType: isFirst
                ? PASSKEY_OPERATE_TYPE.SET_PASSKEY
                : PASSKEY_OPERATE_TYPE.BIND_PASSKEY,
            }),
          },
        },
        (res) => {
          if (res?.code === -200 || res?.msg === '-200') {
            // 「创建 passkey」或「安全验证」离开跳到其他 H5 页面
            // 这种情况不需要提示错误，直接关闭弹窗
            onCancel();
            return;
          }
          setOpen(true);
          setStatus(res.data ? RegisterStatus.success : RegisterStatus.fail);
        },
      );
    } catch (error) {
      toast.error(`Failed to create passkey in app: ${error.message}`);
    }
  };

  useEffect(() => {
    try {
      if (originOpen) {
        trackClick(['createPasskey', '1']);
        if (IS_IN_APP) {
          createPasskeyInApp();
        } else {
          goVerify({
            bizType: PASSKEY_BIZ_TYPE.BIND_PASSKEY,
            businessData: {
              operateType: isFirst
                ? PASSKEY_OPERATE_TYPE.SET_PASSKEY
                : PASSKEY_OPERATE_TYPE.BIND_PASSKEY,
            },
            onSuccess: (res) => {
              passkeyRegister(res);
              setOpen(true);
            },
            onCancel: handleCancel,
          });
        }
      } else {
        setOpen(false);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, [originOpen]);

  useEffect(() => {
    if (currentPasskeyStatus === PasskeyRegisterStatus.SUCCESS) {
      setStatus(RegisterStatus.success);
    } else if (currentPasskeyStatus === PasskeyRegisterStatus.ERROR) {
      setStatus(RegisterStatus.fail);
    } else {
      setStatus(RegisterStatus.init);
    }
  }, [currentPasskeyStatus]);

  return (
    <Modal
      isOpen={open}
      header={null}
      footer={status === RegisterStatus.init ? null : undefined}
      okText={status === RegisterStatus.fail ? _t('retry') : _t('done')}
      onOk={() => {
        if (status === RegisterStatus.fail) {
          if (IS_IN_APP) {
            createPasskeyInApp();
          } else {
            passkeyRegister();
          }
        } else {
          onSuccess();
        }
      }}
      okButtonProps={{ loading }}
      cancelText={status === RegisterStatus.success ? null : _t('cancel')}
      onCancel={handleCancel}
    >
      <div className={styles.content}>
        {status === RegisterStatus.init ? (
          <>
            <img src={passkeyVerifyingSrc} alt="passkey-verifying" />
            <div className={styles.tips}>{_t('2dcf71946f0e4000ab9d')}</div>
            <div style={{ height: '24px' }} />
          </>
        ) : status === RegisterStatus.success ? (
          <>
            <Empty
              name="success"
              size="small"
              title={_t('a3cbcb06275d4000ac98')}
              description={_t('8bf974183b324000a88a')}
            />
          </>
        ) : status === RegisterStatus.fail ? (
          <>
            <Empty
              name="error"
              size="small"
              title={_t('8337e0603eb54800ad31')}
              description={
                <div className={styles.failReason}>
                  <div>
                    {_tHTML('12dc1b4556074800adda', {
                      url: addLangToPath('/support/36658009244057'),
                    })}
                  </div>
                </div>
              }
            />
          </>
        ) : null}
      </div>
    </Modal>
  );
}
