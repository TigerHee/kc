/**
 * Owner: mike@kupotech.com
 */
// 修改区间有两种
// 正常修改 扩展修改 全部actionSheetRef交互
import React, { useRef } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { getSymbolInfo } from 'Bot/hooks/useSpotSymbolInfo';
import { outOfRangeLangConfig, getRangeState } from './RangeWidgets';
import ActionSheetController from './ActionSheetController';
import RangeChoiceWrap from './RangeChoiceWrap';
import ExtendPrice from './ExtendPrice';
import NormalPrice from './NormalPrice';
import NormalFullScreen from './NormalFullScreen';
import UpdateRangeConfirm from './UpdateRangeConfirm';
import { _t, _tHTML } from 'Bot/utils/lang';
import CloseDataRef from 'Bot/components/Common/CloseDataRef';

const UpdatePriceRangeIndex = (props) => {
  const rangeState = getRangeState(props);
  const { actionSheetRef, taskId, noNeedProgressAnimation, onFresh, down, up, symbol } = props;
  const { actionSheetTitle } = outOfRangeLangConfig[rangeState];
  // 扩展区间ref
  const extendPriceActionSheetRef = useRef();
  const updateRangeConfirmActionSheetRef = useRef();
  // 普通修改区间ref
  const normalPriceActionSheetRef = useRef();
  const normalFullScreenActionSheetRef = useRef();
  // 交易对信息
  const symbolInfo = getSymbolInfo(symbol);
  // context Ref
  const controllerRef = useRef({
    choiceData: 0, //  后面设置
    // onChoiceConfirm: () => {},
    rangeChoiceActionSheetRef: actionSheetRef,
    extendPriceActionSheetRef,
    updateRangeConfirmActionSheetRef,

    normalPriceActionSheetRef,
    normalFullScreenActionSheetRef,

    rangeState,
    symbolInfo,
    oldRange: {
      min: down,
      max: up,
      down,
      up,
    },
    taskId,
    noNeedProgressAnimation,
    onFresh,
    options: {}, // 后面设置 弹窗传递数据字段
  });
  // 动态更新 这几个字段 会在打开第一弹窗的时候发生变化 所以需要重新设置
  controllerRef.current.rangeState = rangeState;
  controllerRef.current.oldRange = {
    min: down,
    max: up,
    down,
    up,
  };
  controllerRef.current.noNeedProgressAnimation = noNeedProgressAnimation;
  controllerRef.current.taskId = taskId;
  controllerRef.current.onFresh = onFresh;
  controllerRef.current.symbolInfo = symbolInfo;
  // 动态更新
  // actionSheetRef的点击确定按钮事件触发
  // 在组件内部绑定
  const onChoiceConfirmRef = useRef(() => {
    // 重置哈 以防万一
    controllerRef.current.options = {};
    controllerRef.current && controllerRef.current.onChoiceConfirm();
  });

  return (
    <ActionSheetController.Provider value={controllerRef}>
      {/* 修改区间选择 */}
      <DialogRef
        size="medium"
        maskClosable
        cancelText={null}
        okText={_t('gridwidget6')}
        ref={actionSheetRef}
        title={_t(actionSheetTitle)}
        onOk={onChoiceConfirmRef.current}
        onCancel={() => actionSheetRef.current.toggle()}
      >
        <RangeChoiceWrap />
      </DialogRef>
      {/* 扩展区间 */}
      <DialogRef
        size="medium"
        maskClosable
        cancelText={null}
        okText={_t('nextstep')}
        ref={extendPriceActionSheetRef}
        title={_t('4SfvaBjJAM4Jo8PURM5u8k')}
        onOk={() => extendPriceActionSheetRef.current.confirm()}
        onCancel={() => extendPriceActionSheetRef.current.toggle()}
      >
        <ExtendPrice />
      </DialogRef>
      {/* 普通修改区间 */}
      <DialogRef
        size="medium"
        maskClosable
        cancelText={null}
        okText={_t('nextstep')}
        ref={normalPriceActionSheetRef}
        title={_t('updatepricerange')}
        onOk={() => normalPriceActionSheetRef.current.confirm()}
        onCancel={() => normalPriceActionSheetRef.current.toggle()}
      >
        <NormalPrice />
      </DialogRef>
      {/* 是否保持选择自己还是扩展区间 */}
      <DialogRef
        size="medium"
        maskClosable
        cancelText={_t('machinecopydialog7')}
        okText={_t('hdNyvbXAfdxe2j52n9vCeA')}
        title={_t('updatepricerange')}
        ref={normalFullScreenActionSheetRef}
        onOk={() => normalFullScreenActionSheetRef.current.confirm()}
        onCancel={() => normalFullScreenActionSheetRef.current.toggle()}
      >
        <NormalFullScreen />
      </DialogRef>
      {/* 正常、扩展区间二次确认 */}
      <DialogRef
        size="medium"
        maskClosable
        cancelText={null}
        okText={_t('gridwidget6')}
        ref={updateRangeConfirmActionSheetRef}
        title={_t('gridwidget5')}
        onOk={() => updateRangeConfirmActionSheetRef.current.confirm()}
        onCancel={() => updateRangeConfirmActionSheetRef.current.toggle()}
      >
        <UpdateRangeConfirm />
      </DialogRef>
    </ActionSheetController.Provider>
  );
};

const defaultProps = {
  taskId: '',
  noNeedProgressAnimation: true,
  onFresh: () => {},
  down: '',
  up: '',
  symbol: '',
};
export default CloseDataRef(UpdatePriceRangeIndex, defaultProps);
