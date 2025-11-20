/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useCallback, useState } from 'react';
import _ from 'lodash';
import DialogRef from 'Bot/components/Common/DialogRef';
import AdjustLimit from './AdjustLimit';
import { UpdateBotParams, getBotParams } from 'SmartTrade/services';
import { getLimitTextByMethod, composeChange } from 'SmartTrade/config';
import SubmitSureActionSheet from 'SmartTrade/components/SubmitSureActionSheet';
import useStateRef from '@/hooks/common/useStateRef';
import useMergeState from 'Bot/hooks/useMergeState';
import { dropOthers, timesPercent100 } from 'SmartTrade/util';
import { _t } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';
import { EditRow, Unset } from 'Bot/components/Common/Row';

// 三种使用方式： create update children
export default ({ className, method, stopped, mode, onChange }) => {
  const actionSheetRef = useRef();
  const showSheet = () => {
    if (stopped) return;
    actionSheetRef.current.toggle();
  };
  return (
    <React.Fragment>
      <EditRow
        onClick={showSheet}
        label={_t('autoajust')}
        valueSlot={
          <>
            {/* 未设置 */}
            {_.isEmpty(method) && method.autoChange === undefined ? <Unset /> : null}
            {!_.isEmpty(method) ? (
              <Text className="right" color="text">
                {getLimitTextByMethod(method)}
              </Text>
            ) : null}
          </>
        }
      />
      <AdjustWayDialog dialogRef={actionSheetRef} method={method} onChange={onChange} />
    </React.Fragment>
  );
};

/**
 * @description: 调仓方式弹窗包装
 * @param {Ref} dialogRef
 * @param {Ref<options>} ajustWaysRef 内部调仓获取数据
 * @param {Object} method 调长方式数据
 * @param {*} onChange
 * @return {*}
 */
export const AdjustWayDialog = ({ dialogRef, ajustWaysRef, method, onChange, ...rest }) => {
  const onSubmit = useCallback(
    (val) => {
      if (onChange) {
        onChange(val);
      }
      dialogRef.current.close();
    },
    [onChange],
  );
  return (
    <DialogRef
      title={_t('smart.ajustway')}
      ref={dialogRef}
      cancelText={_t('cancel')}
      okText={_t('confirm')}
      maskClosable
      onCancel={() => dialogRef.current.close()}
      onOk={() => dialogRef.current.confirm()}
      size="medium"
      {...rest}
    >
      <AdjustLimit dialogRef={dialogRef} ref={ajustWaysRef} value={method} onChange={onSubmit} />
    </DialogRef>
  );
};

/**
 * @description: 用于运行中，修改调仓方式；自动关闭没有二次确认弹窗
 * @param {*} updateRef
 * @param {*} taskId
 * @param {Object} method 调仓方式
 * @param {Function} onFresh 刷新函数
 * @param {Boolean} shouldFetchParams 是否需要通过接口获取params大包参数
 * @param {Object<optional>} params shouldFetchParams为false,需要传递次参数
 * @return {*}
 */
export const UpdateMethodWhenRun = ({
  updateRef,
  taskId,
  method = {},
  onFresh,
  params = {},
  shouldFetchParams = true,
}) => {
  const sureRef = useRef();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [options, setMergeState] = useMergeState({
    method: {},
    // 不需要通过接口获取的情况， 就直接初始化赋值
    change: !shouldFetchParams
      ? composeChange(params?.beforeOverview?.snapshots, timesPercent100(params?.targets))
      : [],
    taskId,
  });
  const useDataRef = useStateRef({
    taskId,
    onFresh,
    confirmLoading,
    options,
  });
  method = dropOthers(method);
  const onShow = useCallback(() => {
    // 每次打开都去拿最新的数据
    // 主要使用里面的snapshots， targets
    if (taskId && shouldFetchParams) {
      getBotParams(taskId).then(({ data }) => {
        data = JSON.parse(data);
        // 转换一下，配合composeChange函数使用
        setMergeState({
          change: composeChange(data?.beforeOverview?.snapshots, timesPercent100(data?.targets)),
        });
      });
    }
  }, []);
  const toSubmit = useCallback((newMethod, next) => {
    if (useDataRef.current.confirmLoading) return;
    setConfirmLoading(true);
    UpdateBotParams({ taskId: useDataRef.current.taskId, method: newMethod })
      .then(() => {
        // message.success(_t('runningdetail'));
        if (useDataRef.current.onFresh) {
          useDataRef.current.onFresh();
        }
        if (next) {
          next();
        }
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  }, []);
  const onUpdate = useCallback((newMethod) => {
    // 大家二次确认actionSheet前需要获取到变化前后的数据
    // 关闭自动调仓不需要确认，直接就提交
    if (newMethod.autoChange === false) {
      // confirmLoading只充当锁的功能
      toSubmit(newMethod);
    } else {
      setMergeState({
        method: newMethod,
      });
      updateRef.current.close();
      sureRef.current.show();
    }
  }, []);
  // 二次提交函数，可以满足阈值/时间的提交
  const onConfirm = useCallback(() => {
    toSubmit(useDataRef.current.options.method, () => {
      sureRef.current.close();
    });
  }, []);
  return (
    <React.Fragment>
      <AdjustWayDialog onShow={onShow} dialogRef={updateRef} method={method} onChange={onUpdate} />
      <SubmitSureActionSheet
        dialogRef={sureRef}
        confirmLoading={confirmLoading}
        onConfirm={onConfirm}
        options={options}
        desc={_t('smart.instaceajust')}
      />
    </React.Fragment>
  );
};
/**
 * @description: 用于参数设置页面修改调仓方式；自动关闭没有二次确认弹窗
 * @return {*}
 */
export const UpdateMethodInParameterPage = ({ stopped, params, className, onFresh, taskId }) => {
  const method = dropOthers(params.method);
  const updateRef = useRef();
  const showSheet = () => {
    if (stopped) return;
    updateRef.current.toggle();
  };
  return (
    <React.Fragment>
      <EditRow
        onClick={showSheet}
        label={_t('autoajust')}
        fs={16}
        lh="130%"
        mb={12}
        labelProps={{ color: 'text' }}
        hasArrow={!stopped}
        valueSlot={
          <>
            {/* 未设置 */}
            {_.isEmpty(method) && method.autoChange === undefined ? <Unset /> : null}
            {!_.isEmpty(method) ? (
              <Text className="right" color="text">
                {getLimitTextByMethod(method)}
              </Text>
            ) : null}
          </>
        }
      />
      <UpdateMethodWhenRun
        updateRef={updateRef}
        taskId={taskId}
        method={method}
        onFresh={onFresh}
        shouldFetchParams={false}
        params={params}
      />
    </React.Fragment>
  );
};
