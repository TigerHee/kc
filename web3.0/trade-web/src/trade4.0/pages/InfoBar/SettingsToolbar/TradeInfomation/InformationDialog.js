/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-03 15:41:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-23 15:16:02
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/SettingsToolbar/TradeInfomation/InformationDialog.js
 * @Description:
 */
/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';

import Dialog from '@mui/Dialog';

import { _t, _tHTML } from 'utils/lang';

import { DialogContentWrapper } from '../style';
import { useInformationDialog } from './useInformationProps';

/**
 * TradeInfomation
 * 交易信息模块弹框
 */
const InformationDialog = () => {
  const [dialogProps, setDialogProps] = useInformationDialog();

  return (
    <>
      <Dialog
        header={dialogProps.payload.header}
        title={dialogProps.payload.title}
        open={dialogProps.visible}
        onOk={() => setDialogProps((prev) => ({ ...prev, visible: false }))}
        onCancel={
          dialogProps.payload.onCancel
            ? () => {
                setDialogProps((prev) => ({ ...prev, visible: false }));
                dialogProps.payload.onCancel();
              }
            : () => setDialogProps((prev) => ({ ...prev, visible: false }))
        }
        // onOk={() => window.open(dialogProps.payload.url)}
        okText={dialogProps.payload.okText ? dialogProps.payload.okText : _t('confirm')}
        cancelText={dialogProps.payload.cancelText ? dialogProps.payload.cancelText : null}
        back={false}
        destroyOnClose
        showCloseX={dialogProps.payload.showCloseX}
        centeredFooterButton={!!dialogProps.payload.centeredFooterButton}
      >
        <DialogContentWrapper>{dialogProps.payload.content}</DialogContentWrapper>
      </Dialog>
    </>
  );
};

export default memo(InformationDialog);
