/**
 * Owner: garuda@kupotech.com
 * 此 flow 控制弹框队列
 */

import { useState, useRef, useCallback, useEffect } from 'react';

import { MARGIN_MODE_CROSS } from '../../builtinCommon';
import { CHECK_DEFAULT_FLOWS, CHECK_CROSS_DEFAULT_FLOWS, CHECK_FLOW } from '../../config';

import { useGetActiveTab } from '../../hooks/useGetData';
import { tradeOrderStopSensors } from '../../utils';

export const useConfirmFlow = () => {
  const [open, setOpen] = useState(false);
  const [confirmHolder, setConfirmHolder] = useState({});
  const [contentType, setContentType] = useState(null);
  const confirmRetention = useRef(null);
  const confirmType = useRef(null);
  const currentConfirmType = useRef(null);

  const { orderType } = useGetActiveTab();

  // 埋点
  useEffect(() => {
    if (open && confirmHolder?.sensors?.expose) {
      confirmHolder.sensors.expose();
    }
  }, [confirmHolder, open]);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setConfirmHolder({});
    setContentType(null);
  }, []);

  const showDialog = useCallback((currentType) => {
    setConfirmHolder(currentType);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    closeDialog();
    // 如果缓存值里有需要 close 执行的函数，也需要执行一次
    if (confirmRetention.current?.onClose) {
      confirmRetention.current.onClose();
    }
    // 埋点
    tradeOrderStopSensors({ type: currentConfirmType?.current || 'confirm' });
    // 埋点
    if (confirmHolder?.sensors?.close) {
      confirmHolder.sensors.close();
    }
  }, [closeDialog, confirmHolder.sensors]);

  const setContentTypeFlow = useCallback(() => {
    const currentCheck = confirmType.current?.shift();
    currentConfirmType.current = currentCheck;
    console.log('confirmType --->', confirmType.current);
    const { checkRule, type } = CHECK_FLOW[currentCheck] || {};
    console.log('checkRule --->', checkRule, type);
    // 如果没有校验规则，则直接 走 callback return，不走后续流程
    if (!checkRule || !type) {
      try {
        closeDialog();
        const { values, confirm } = confirmRetention.current;
        console.log('confirmRetention --->', confirmRetention.current);
        confirm && confirm(values);
        // 埋点
        if (confirmHolder?.sensors?.ok) {
          confirmHolder.sensors.ok();
        }
      } catch (err) {
        console.error('futures confirm order error --->', err);
      }
      return;
    }
    // check 是否符合订单类型规则，不符合则再次走 flow 流程
    if (checkRule?.includes(orderType)) {
      setContentType(type);
    } else {
      setContentTypeFlow();
    }
  }, [closeDialog, confirmHolder.sensors, orderType]);

  // 开启校验流程，通过检测 checkFlows 的方式 逐步渲染后续流程弹框，每次开启之前应该先关闭之前的弹框
  const handleConfirmFlow = useCallback(
    ({ checkFlows = [], values, confirm }) => {
      closeDialog();
      confirmRetention.current = null;
      confirmRetention.current = { values, confirm };
      console.log('handle confirm flow --->', confirmRetention.current);
      // 如果没传递 check 流程，走默认逻辑
      if (!checkFlows || !checkFlows?.length) {
        confirmType.current =
          values?.marginMode === MARGIN_MODE_CROSS
            ? [...CHECK_CROSS_DEFAULT_FLOWS]
            : [...CHECK_DEFAULT_FLOWS];
      } else {
        confirmType.current = typeof checkFlows === 'string' ? [checkFlows] : [...checkFlows];
      }

      console.log('handle confirm flow --->', checkFlows, confirmType.current);
      setContentTypeFlow();
    },
    [closeDialog, setContentTypeFlow],
  );

  return {
    open,
    setOpen,
    confirmHolder,
    contentType,
    confirmRetention,
    handleClose,
    handleConfirmFlow,
    setConfirmHolder,
    setContentTypeFlow,
    confirmType,
    showDialog,
  };
};
