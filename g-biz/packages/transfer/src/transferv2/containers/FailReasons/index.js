/**
 * Owner: solar@kupotech.com
 */
import { useCallback, useMemo } from 'react';
import { Table } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { useTransferSelector, useTransferDispatch } from '../../utils/redux';
import { useProps } from '../../hooks/props';
import { StyledFailReason } from './style';

export default function FailReason() {
  const { t: _t } = useTranslation('transfer');
  const { reOpen, onClose } = useProps();
  const failReasons = useTransferSelector((state) => state.failReasons);

  const dispatchTransfer = useTransferDispatch();
  const handleCancel = useCallback(() => {
    dispatchTransfer({
      type: 'update',
      payload: {
        failReasons: [],
      },
    });
    onClose();
  }, []);
  const handleOk = useCallback(() => {
    dispatchTransfer({
      type: 'update',
      payload: {
        failReasons: [],
      },
    });
    setTimeout(() => {
      reOpen();
    }, 3000);
  }, []);
  const columns = useMemo(
    () => [
      {
        title: 'aaa',
        dataIndex: 'currency',
        key: 'currency',
      },
      {
        title: 'bbb',
        dataIndex: 'failMsg',
        key: 'failMsg',
      },
    ],
    [],
  );
  const show = useMemo(() => Boolean(failReasons.length), [failReasons]);
  return (
    <StyledFailReason
      title={_t('jZbvwffKKCTMauSygcATpF')}
      open={show}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={_t('ss1u4HHoucbtitKWM5vsQk')}
      cancelText={_t('oUewJiWrkqSaAegqZJUkcW')}
    >
      <div className="title">{_t('mAraJ2gc2okKWYLEyzfcaD')}</div>
      <Table
        showHeader={false}
        dataSource={failReasons}
        columns={columns}
        rowKey="key"
        bordered
        headerType={'transparent'}
      />
    </StyledFailReason>
  );
}
