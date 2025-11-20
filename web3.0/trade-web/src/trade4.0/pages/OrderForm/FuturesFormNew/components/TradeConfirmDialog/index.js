/**
 * Owner: garuda@kupotech.com
 * 唤起弹框，发送 CONFIRM_DIALOG_EVENT_KEY 事件，事件接收 { values, confirm, checkFlows = [] } 三个参数对象
 * 当 checkFlows 未传递时，会走默认流程，默认流程弹框配置 CHECK_DEFAULT_FLOWS
 * 当传入 checkFlows 时，会根据 checkFlows 传递的值，唤起对应的弹框，该值支持 string | Array []
 *
 * 配置弹框 SHOW_CURRENT_CONTENT，参考配置
 */

import React, { useEffect, useCallback } from 'react';

import muiDialog from '@mui/Dialog';

import { validatorDeep, validatorPriceGap } from './config';

import DeepIntoRival from './DeepIntoRival';
import { useConfirmFlow } from './hooks';

import OrderConfirm from './OrderConfirm';
import PriceGapRisk from './PriceGapRisk';
import { useCheckRiskLimitProps, useRiskLimitProps } from './RiskLimitDialog/hooks';

import RiskLimitAutoChangeDialog from './RiskLimitDialog/RiskLimitAutoChangeDialog';
import RiskLimitGuideChangeDialog from './RiskLimitDialog/RiskLimitGuideChangeDialog';
import RiskLimitOrderDialog from './RiskLimitDialog/RiskLimitOrderDialog';

import { Title as RiskLimitTitle, SymbolTextWrapper } from './RiskLimitDialog/style';

import {
  evtEmitter,
  styled,
  _t,
  trackExposeS,
  trackClick,
  RISK_LIMIT_AUTO,
  RISK_LIMIT_GUIDE,
  RISK_LIMIT_ORDER,
} from '../../builtinCommon';

import {
  CHECK_DEEP,
  CHECK_PRICE_GAP,
  CHECK_CONFIRM,
  CHECK_RISK_LIMIT_GUIDE,
  CHECK_RISK_LIMIT_AUTO,
  CHECK_RISK_LIMIT_ORDER,
  CONFIRM_DIALOG_EVENT_KEY,
} from '../../config';

import { getSetting } from '../../hooks/useGetData';

const Dialog = styled(muiDialog)`
  &.risk-limit-dialog {
    .KuxDialog-body {
      max-width: 520px;
    }
    &.KuxMDrawer-root {
      .KuxModalHeader-root {
        height: auto;
        .KuxModalHeader-title {
          padding: 12px 0;
        }
      }
    }
  }
  &.header-null {
    .KuxDialog-body {
      .KuxDialog-content {
        padding-top: 24px;
      }
    }
  }
`;

// 弹框配置
const SHOW_CURRENT_CONTENT = {
  [CHECK_DEEP]: {
    title: () => null,
    Content: DeepIntoRival,
    footer: null,
    dialogProps: {
      className: 'risk-limit-dialog header-null',
      showCloseX: false,
      header: null,
    },
  },
  [CHECK_PRICE_GAP]: {
    title: () => _t('open.riskTips'),
    Content: PriceGapRisk,
    footer: null,
  },
  [CHECK_CONFIRM]: {
    title: () => _t('trade.confirm.title'),
    Content: OrderConfirm,
    footer: null,
    dialogProps: {
      className: 'risk-limit-dialog',
    },
  },
  [CHECK_RISK_LIMIT_GUIDE]: {
    title: () => _t('risk.limit.low.title'),
    Content: RiskLimitGuideChangeDialog,
    dialogProps: {
      okText: _t('adjust.risk.limit'),
      cancelText: _t('cancel'),
    },
    sensors: {
      expose: () => trackExposeS(RISK_LIMIT_GUIDE),
      close: () => trackClick([RISK_LIMIT_GUIDE, '1']),
      ok: () => trackClick([RISK_LIMIT_GUIDE, '2']),
    },
  },
  [CHECK_RISK_LIMIT_AUTO]: {
    title: (params) => {
      console.log('params --->', params);
      return (
        <RiskLimitTitle>
          <h3>{_t('risk.limit.autoChange.title')}</h3>
          <SymbolTextWrapper symbol={params?.symbol} />
        </RiskLimitTitle>
      );
    },
    Content: RiskLimitAutoChangeDialog,
    dialogProps: {
      okText: _t('security.form.btn'),
      cancelText: _t('cancel'),
      className: 'risk-limit-dialog',
    },
    sensors: {
      expose: () => trackExposeS(RISK_LIMIT_AUTO),
      close: () => trackClick([RISK_LIMIT_AUTO, '1']),
      ok: () => trackClick([RISK_LIMIT_AUTO, '2']),
    },
  },
  [CHECK_RISK_LIMIT_ORDER]: {
    title: () => _t('risk.limit.successTitle'),
    Content: RiskLimitOrderDialog,
    footer: null,
    dialogProps: {
      className: 'risk-limit-dialog',
    },
    sensors: {
      expose: () => trackExposeS(RISK_LIMIT_ORDER),
      close: () => trackClick([RISK_LIMIT_ORDER, '1']),
      ok: () => trackClick([RISK_LIMIT_ORDER, '2']),
    },
  },
};

const eventHandle = evtEmitter.getEvt();
const TradeConfirmDialog = () => {
  const {
    open,
    confirmHolder,
    contentType,
    confirmRetention,
    handleClose,
    handleConfirmFlow,
    setContentTypeFlow,
    confirmType,
    showDialog,
  } = useConfirmFlow();
  const { checkExceedRiskLimit } = useCheckRiskLimitProps();
  const { onSuccessDialogOK, onAutoDialogOK, onDialogClose, showOrderDialog } = useRiskLimitProps();

  // check 是否展示深入买卖盘弹框
  const handleCheckDeep = useCallback(() => {
    const { deepConfirm } = getSetting();
    if (deepConfirm && confirmRetention.current?.values) {
      const deep = validatorDeep(confirmRetention.current);
      if (deep) {
        showDialog(SHOW_CURRENT_CONTENT[CHECK_DEEP]);
        return;
      }
    }
    setContentTypeFlow();
  }, [confirmRetention, setContentTypeFlow, showDialog]);

  // check 是否需要展示价差过大弹框
  const handleCheckPriceGap = useCallback(() => {
    const { priceGapConfirm } = getSetting();
    if (priceGapConfirm && confirmRetention.current?.values) {
      const priceGapRisk = validatorPriceGap(confirmRetention.current);
      if (priceGapRisk) {
        showDialog(SHOW_CURRENT_CONTENT[CHECK_PRICE_GAP]);
        return;
      }
    }
    setContentTypeFlow();
  }, [confirmRetention, setContentTypeFlow, showDialog]);

  // check 是否需要展示二次确认弹框
  const handleCheckConfirm = useCallback(() => {
    const { confirmOrder } = getSetting();
    if (confirmOrder && confirmRetention.current?.values) {
      showDialog(SHOW_CURRENT_CONTENT[CHECK_CONFIRM]);
      return;
    }
    setContentTypeFlow();
  }, [confirmRetention, setContentTypeFlow, showDialog]);

  // check 是否需要展示风险限额校验引导
  const handleCheckRiskLimitGuide = useCallback(() => {
    if (confirmRetention.current?.values) {
      const checkExceedRisk = checkExceedRiskLimit(confirmRetention.current.values);
      console.log('checkExceedRisk --->', checkExceedRisk);
      // 需要校验，才追加单独确认流程
      if (checkExceedRisk) {
        if (!confirmType.current.includes(CHECK_RISK_LIMIT_AUTO)) {
          confirmType.current.push(CHECK_RISK_LIMIT_AUTO);
        }
        confirmRetention.current = {
          ...confirmRetention.current,
          onClose: onDialogClose,
        };
        showDialog(SHOW_CURRENT_CONTENT[CHECK_RISK_LIMIT_GUIDE]);
        return;
      }
    }
    setContentTypeFlow();
  }, [
    checkExceedRiskLimit,
    confirmRetention,
    confirmType,
    onDialogClose,
    setContentTypeFlow,
    showDialog,
  ]);

  // 风险限额变动弹框信息
  const handleCheckRiskLimitAuto = useCallback(() => {
    confirmRetention.current = {
      ...confirmRetention.current,
      confirm: onAutoDialogOK,
      onClose: onDialogClose,
    };
    showDialog(SHOW_CURRENT_CONTENT[CHECK_RISK_LIMIT_AUTO]);
  }, [confirmRetention, onAutoDialogOK, onDialogClose, showDialog]);

  // 风险限额下单弹框
  const handleCheckRiskLimitOrder = useCallback(() => {
    confirmRetention.current = {
      ...confirmRetention.current,
      onClose: onDialogClose,
    };
    if (showOrderDialog) {
      confirmRetention.current.confirm = onSuccessDialogOK;
      showDialog(SHOW_CURRENT_CONTENT[CHECK_RISK_LIMIT_ORDER]);
      return;
    }
    setContentTypeFlow();
  }, [
    confirmRetention,
    onDialogClose,
    showOrderDialog,
    setContentTypeFlow,
    onSuccessDialogOK,
    showDialog,
  ]);

  const handleCheckContent = useCallback(
    (type) => {
      console.log('handleCheckContent --->', type);
      const checkMap = {
        // 默认校验流程
        [CHECK_DEEP]: handleCheckDeep,
        [CHECK_PRICE_GAP]: handleCheckPriceGap,
        [CHECK_CONFIRM]: handleCheckConfirm,
        [CHECK_RISK_LIMIT_GUIDE]: handleCheckRiskLimitGuide,
        // 单独校验流程
        [CHECK_RISK_LIMIT_AUTO]: handleCheckRiskLimitAuto,
        [CHECK_RISK_LIMIT_ORDER]: handleCheckRiskLimitOrder,
      };
      return checkMap[type] && checkMap[type]();
    },
    [
      handleCheckConfirm,
      handleCheckDeep,
      handleCheckPriceGap,
      handleCheckRiskLimitAuto,
      handleCheckRiskLimitGuide,
      handleCheckRiskLimitOrder,
    ],
  );

  // 监听 type 发生变化，开启校验
  useEffect(() => {
    handleCheckContent(contentType);
  }, [contentType, handleCheckContent]);

  // 监听开始确认的流程
  useEffect(() => {
    eventHandle.on(`${CONFIRM_DIALOG_EVENT_KEY}`, handleConfirmFlow);
    return () => {
      eventHandle.off(`${CONFIRM_DIALOG_EVENT_KEY}`, handleConfirmFlow);
    };
  }, [handleConfirmFlow]);

  return (
    <Dialog
      title={confirmHolder.title ? confirmHolder.title(confirmRetention.current.values) : null}
      open={open}
      destroyOnClose
      footer={confirmHolder.footer}
      onClose={handleClose}
      onOk={setContentTypeFlow}
      {...confirmHolder.dialogProps}
    >
      {confirmHolder.Content ? (
        <confirmHolder.Content
          {...confirmRetention.current}
          onClose={handleClose}
          onOk={setContentTypeFlow}
        />
      ) : null}
    </Dialog>
  );
};

export default React.memo(TradeConfirmDialog);
