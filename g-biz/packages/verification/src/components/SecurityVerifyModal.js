/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useRef, useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import InnerForm from './InnerForm';
import ErrorDialog from './ErrorDialog';
import CommonModal from './CommonModal';
import useLang from '../hooks/useLang';
import * as sensors from '../utils/sensors';
import { METHODS } from '../constants';
import Passkey from './Passkey';
import MethodSelector from './MethodSelector';

export default function SecurityVerifyModal(props) {
  const {
    bizType,
    transactionId,
    methods,
    supplement,
    error,
    errorRender,
    onSuccess,
    onDestroy,
  } = props;
  const { _t } = useLang();
  const [open, setOpen] = useState(true);
  const dialogRef = useRef();
  const [switchOpen, setSwitchOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(methods[0]);
  const [title, setTitle] = useState('');

  const handleTitleChange = (val) => setTitle(val);

  const handleSwitch = (noSelect = false) => {
    sensors.clickChangeMethod({ bizType, transactionId });
    if (methods.length === 2 || noSelect) {
      // 仅有2个方案或不需要选择时，点击切换直接，不需要弹窗选择
      const index = methods.findIndex((method) => method !== selectedMethod);
      setSelectedMethod(methods[index]);
    } else {
      setSwitchOpen(true);
    }
  };

  const onDialogHidden = () => {
    const dialogBody = dialogRef.current?.querySelector('[data-testid="security-verify-modal"]');
    if (dialogBody) {
      dialogBody.addEventListener('animationend', onDestroy, { once: true });
    } else {
      onDestroy();
    }
    setOpen(false);
  };

  useEffect(
    () => {
      if (!error) {
        sensors.exposeModal({ bizType, transactionId });
      }
      const handlePageShow = (e) => {
        if (e.persisted) {
          // 监听是否缓存页面，是的话刷新拉取最新数据
          window.location.reload();
        }
      };
      window.addEventListener('pageshow', handlePageShow);
      return () => window.removeEventListener('pageshow', handlePageShow);
    },
    [
      /** 只执行一次 */
    ],
  );

  if (error) {
    return (
      <ErrorDialog
        code={error?.code}
        supplement={supplement}
        ref={dialogRef}
        errorRender={errorRender}
        open={open}
        data-testid="security-verify-modal"
        onCancel={() => {
          onDialogHidden();
          onSuccess('');
        }}
      />
    );
  }

  const isPasskey = isEqual(selectedMethod, [METHODS.PASSKEY]);
  const handleCancel = () => {
    sensors.canceled({ bizType, transactionId });
    sensors.closeModal({ bizType, transactionId });
    onDialogHidden();
    onSuccess('');
  };

  return (
    <>
      <CommonModal
        ref={dialogRef}
        open={open}
        data-testid="security-verify-modal"
        size={isPasskey ? 'basic' : 'medium'}
        smallMarginBottom={isPasskey}
        title={title}
        onCancel={handleCancel}
      >
        {isPasskey ? (
          <Passkey
            bizType={bizType}
            transactionId={transactionId}
            supplement={supplement}
            canSwitch={methods.length > 1}
            onSwitch={() => handleSwitch(true)}
            onTitleChange={handleTitleChange}
            onSuccess={(token) => {
              sensors.passed({ bizType, transactionId });
              sensors.closeModal({ bizType, transactionId });
              onDialogHidden();
              onSuccess(token);
            }}
          />
        ) : (
          <InnerForm
            bizType={bizType}
            transactionId={transactionId}
            selectedMethod={selectedMethod}
            showSwitch={methods.length > 1}
            onSwitch={() => handleSwitch(false)}
            onTitleChange={handleTitleChange}
            onSuccess={(token) => {
              sensors.passed({ bizType, transactionId });
              sensors.closeModal({ bizType, transactionId });
              onDialogHidden();
              onSuccess(token);
            }}
          />
        )}
      </CommonModal>
      <CommonModal
        open={switchOpen}
        size="medium"
        title={_t('95018f7c441f4000a3f2')}
        onCancel={() => setSwitchOpen(false)}
      >
        <MethodSelector
          methods={methods.filter((method) => method !== selectedMethod)}
          onChange={(newMethod) => {
            setSelectedMethod(newMethod);
            setSwitchOpen(false);
          }}
        />
      </CommonModal>
    </>
  );
}
