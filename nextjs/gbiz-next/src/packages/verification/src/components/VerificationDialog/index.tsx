import { useEffect, useState } from 'react';
import { ERROR_CODE, METHODS } from '../../enums';
import Verification, { VerificationProps } from '../Verification';
import { useVerification } from '../Verification/model';
import useModalSize from '../../hooks/useModalSize';
import { canceled, closeModal, exposeModal, initialized, noVerify } from '../../utils/sensors';
import { Modal } from '@kux/design';
import ErrorInfo from '../Verification/components/ErrorInfo';
import Title from '../Title';
import styles from './styles.module.scss';
import clsx from 'clsx';

export interface VerificationController {
  close: () => void;
}

export type VerificationDialogProps = Omit<VerificationProps, 'transactionId'> & {
  businessData: Record<string, any>;
  permitValidateType: METHODS[] | undefined;
  options: { token?: string; address?: string };
  onRef?: (controller: VerificationController) => void;
};

export default function VerificationDialog({
  bizType,
  businessData,
  permitValidateType,
  options,
  errorRender,
  onSuccess,
  onCancel,
  onUnavailable,
  onRef,
}: VerificationDialogProps) {
  const [open, setOpen] = useState(false);
  const { combineResult, pullCombineResult } = useVerification();
  const { transactionId, errorCode, supplement = [] } = combineResult || {};
  const size = useModalSize();

  const handleCancel = () => {
    setOpen(false);
    canceled({ bizType, transactionId });
    closeModal({ bizType, transactionId });
    onCancel?.();
  };

  useEffect(() => {
    // 向外暴露控制器，用于外部关闭弹窗
    onRef?.({
      close: () => {
        setOpen(false);
      },
    });
  }, []);

  useEffect(() => {
    initialized({ bizType, transactionId });
    pullCombineResult({
      bizType,
      options,
      businessData,
      permitValidateType,
    }).then(({ transactionId, needVerify, token, isNeedLiveVerify, isNeedSelfService }) => {
      if (!needVerify && token) {
        noVerify({ bizType, transactionId });
        onSuccess({
          headers: { 'X-VALIDATION-TOKEN': token },
          data: { isNeedLiveVerify, isNeedSelfService },
        });
      } else {
        setOpen(true);
      }
    });
  }, []);

  useEffect(
    () => {
      if (!errorCode) {
        exposeModal({ bizType, transactionId });
      }
    },
    [],
  );

  if (errorCode) {
    return (
      <Modal
        isOpen={open}
        title={<Title />}
        onClose={handleCancel}
        footer={null}
        mobileTransform
        className={clsx(
          styles.commonDialog,
          styles.errorDialog,
          ![ERROR_CODE.GO_TO_SECURITY, ERROR_CODE.GO_TO_MAIN_ACCOUNT].includes(errorCode as ERROR_CODE) && styles.headerCloser
        )}
      >
        {errorRender?.(errorCode, { onCancel }) || (
          <ErrorInfo bizType={bizType} code={errorCode} supplement={supplement} onCancel={handleCancel} />
        )}
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={open}
      title={<Title />}
      size={size}
      onClose={handleCancel}
      footer={null}
      mobileTransform
      className={styles.commonDialog}
    >
      {combineResult ? (
        <Verification
          bizType={bizType}
          errorRender={errorRender}
          onSuccess={res => {
            setOpen(false);
            onSuccess(res);
          }}
          onCancel={handleCancel}
          onUnavailable={onUnavailable}
        />
      ) : null}
    </Modal>
  );
}
