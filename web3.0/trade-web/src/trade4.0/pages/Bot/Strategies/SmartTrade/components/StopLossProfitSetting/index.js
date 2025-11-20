/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useCallback, useState } from 'react';
import { _t, _tHTML } from 'Bot/utils/lang';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import { formatNumber, dropZero, reverseText } from 'Bot/helper';
import Decimal from 'decimal.js';
import useStateRef from '@/hooks/common/useStateRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import Row, { EditRow, Unset } from 'Bot/components/Common/Row';
import { ChangeRate } from 'Bot/components/ColorText';
import { Radio, useSnackbar } from '@kux/mui';
import { maxAutoSell, showNotSupportBigSell } from 'SmartTrade/config';
import { UpdateBotParams } from 'SmartTrade/services';
import { Text } from 'Bot/components/Widgets';
import Alert from '@mui/Alert';
import GridInput from 'Bot/components/Common/GridInput';

const isEmpty = (val) => {
  return isNaN(Number(val)) || Number(val) === 0;
};
/**
 * @description: 计算当前亏损比例
 * @param {Object} open 当前委托数据
 * @return {*}
 */
const calcLossProfitRatio = (open) => {
  let { totalValue, investmentValue } = open;
  totalValue = +totalValue;
  investmentValue = +investmentValue;
  return Number((((totalValue - investmentValue) / investmentValue)).toFixed(8));
};

const maxStopPrecision = 2;
const sceneConfig = {
  loss: {
    key1: 'isSellOnStopLoss',
    key2: 'loss',
    key3: 'stopLoss',
    contentKey: 'notsupportbignumberloss',
    max: 100,
    placeholder: '1 ~ 100',
    mainText: {
      lang: 'losshowmuch',
      key1: 'loss',
      key2: 'lossnum',
    },
    updateText: 'lossoverhint',
    percents: [10, 25, 50, 75, 100],
    row: {
      label: 'zhishunbyratio',
      update: 'updatestoploss',
      create: 'lossstop',
      color: 'secondary',
      sign: '-',
    },
    deleteKey: 'isDeleteStopLoss',
    initValue: (params) => params.stopLoss ?? 15,
  },
  profit: {
    key1: 'isSellOnStopProfit',
    key2: 'profit',
    key3: 'stopProfit',
    contentKey: 'notsupportbignumberprofit',
    max: 500,
    placeholder: '1 ~ 500',
    mainText: {
      lang: 'profithowmuch',
      key1: 'profit',
      key2: 'profitnum',
    },
    updateText: 'profitoverhint',
    percents: [25, 50, 75, 100, 200, 500],
    row: {
      label: 'zhiyinngbyratio',
      update: 'updateprofit',
      create: 'takeprofit',
      color: 'primary',
      sign: '+',
    },
    deleteKey: 'isDeleteStopProfit',
    initValue: (params) => params.stopProfit ?? 50,
  },
};
/**
 * @description:
 * @param {Enum} scene (loss, profit)
 * @param {Enum} mode (create, update)
 * @param {Object} open 当前委托接口数据。更新模式的时候会用到
 * @param {Object} params 当前设置接口数据
 * @return {*}
 */
const StopLossByRatioSheet = ({
  scene,
  mode = 'update',
  onSubmit,
  actionSheetRef,
  params,
  open,
  taskId,
  onFresh,
}) => {
  const meta = sceneConfig[scene];
  const { message } = useSnackbar();

  const totalInvestmentUsdt = +params.totalInvestmentUsdt;
  //   是否超过最大卖出额
  const isOverMax = totalInvestmentUsdt > maxAutoSell;
  const [radioValue, setRadioValue] = useState(() => {
    let initRadioValue;
    // 之前的值
    if (typeof params[meta.key1] === 'boolean') {
      initRadioValue = Number(params[meta.key1]);
    } else {
      // 第一次
      initRadioValue = isOverMax ? 0 : 1;
    }
    return initRadioValue;
  });
  const onRadioChange = useCallback((e) => {
    setRadioValue(Number(e.target.value));
  }, []);

  const [inputRateValue, setInputRateValue] = useState(meta.initValue(params));
  // 提交函数
  const useDataRef = useStateRef({
    submit: async (BeforeLoadingObj, data) => {
      // 创建向上抛出
      if (mode === 'create') {
        onSubmit &&
          onSubmit({
            type: meta.key2,
            data,
          });
        actionSheetRef.current.toggle();
      } else {
        // 修改直接接口提交
        actionSheetRef.current.updateBtnProps({
          okButtonProps: {
            loading: BeforeLoadingObj.confirm,
          },
          cancelButtonProps: {
            loading: BeforeLoadingObj.cancel,
          },
        });
        const res = await UpdateBotParams(data).catch(() => {});
        actionSheetRef.current.updateBtnProps({
          okButtonProps: {
            loading: false,
          },
          cancelButtonProps: {
            loading: false,
          },
        });
        if (res) {
          onFresh && onFresh();
          actionSheetRef.current.toggle();
          message.success(_t('runningdetail'));
        }
      }
    },
    [meta.key3]: inputRateValue,
    [meta.key1]: Boolean(radioValue),
    mode,
  });

  const onCancel = useCallback(() => {
    const { submit, mode: cmode } = useDataRef.current;
    submit(
      { cancel: true, confirm: false },
      cmode === 'create'
        ? { [meta.key3]: undefined, [meta.key1]: undefined }
        : { taskId, [meta.deleteKey]: true },
    );
  }, []);

  const onConfirm = useCallback((_) => {
    const { submit } = useDataRef.current;
    const key1Val = useDataRef.current[meta.key1];
    const key3Val = useDataRef.current[meta.key3];
    submit(
      { cancel: false, confirm: true },
      { taskId, [meta.key1]: key1Val, [meta.key3]: key3Val },
    );
  }, []);

  //  大于10万，不支持自动卖出
  const showOverMaxHint = () => {
    if (isOverMax) {
      showNotSupportBigSell({
        contentKey: meta.contentKey,
        rate: inputRateValue,
      });
    }
  };

  const nowLossProfitRatio = mode === 'update' ? calcLossProfitRatio(open) : 0;
  const showInputRateValue = inputRateValue || 0;
  const num = totalInvestmentUsdt
    ? dropZero(
        Decimal(totalInvestmentUsdt)
          .times(showInputRateValue)
          .div(100)
          .toFixed(maxStopPrecision, Decimal.ROUND_DOWN),
      )
    : '-';

  const isShowInstanceStop =
    radioValue === 1 &&
    nowLossProfitRatio < 0 &&
    inputRateValue &&
    inputRateValue < Math.abs(nowLossProfitRatio);

  const onGridChange = useCallback((val) => {
    setInputRateValue(Decimal(val).times(100).toNumber());
  }, []);
  useBindDialogButton(actionSheetRef, {
    onConfirm,
    onCancel,
  });
  return (
    <div className="pt-8">
      <InputNumber
        label={`${_t(meta.row.label)}(${meta.placeholder})`}
        unit="%"
        min={1}
        max={meta.max}
        maxPrecision={0}
        placeholder={meta.placeholder}
        onChange={setInputRateValue}
        value={inputRateValue}
        variant="default"
      />
      <GridInput percents={meta.percents} onGridChange={onGridChange} mt={10} />

      <Text className="how-much" color="text" fs={14} as="div" mt={16} mb={16}>
        {_tHTML(meta.mainText.lang, {
          [meta.mainText.key1]: `${showInputRateValue}%`,
          [meta.mainText.key2]: num,
        })}
      </Text>
      <Radio.Group value={radioValue} onChange={onRadioChange}>
        <Radio value={1} disabled={isOverMax} onClick={showOverMaxHint}>
          {_t('autosell')}
        </Radio>
        <Radio value={0}>
          <Text color="complementary">{_t('onlynotice')} </Text>
          {_t('notsell')}
        </Radio>
      </Radio.Group>

      {mode === 'update' && (
        <>
          <Row
            mt={8}
            label={_t('gridform29')}
            unit="USDT"
            value={formatNumber(totalInvestmentUsdt, 8)}
          />
          <Row label={_t('currentlprate')} value={<ChangeRate value={nowLossProfitRatio} />} />
          {isShowInstanceStop && (
            <Alert type="info" title={_tHTML(meta.updateText, { rate: `${inputRateValue}%` })} />
          )}
        </>
      )}
    </div>
  );
};

export default ({
  className,
  classLabelName,
  params,
  open,
  taskId,
  stopped,
  mode,
  onSubmit,
  onFresh,
  scene,
}) => {
  const actionSheetRef = useRef();
  const showSheet = () => {
    if (stopped) return;
    actionSheetRef.current.toggle();
  };
  const meta = sceneConfig[scene];
  return (
    <>
      <EditRow
        className="lossprofit-setting"
        label={_t(meta.row.label)}
        onClick={showSheet}
        hasArrow={!stopped}
        valueSlot={
          isEmpty(params[meta.key3]) ? (
            <Unset />
          ) : (
            <Text color={meta.row.color}>
              {meta.row.sign}
              {reverseText(`${params[meta.key3] }%`)} ({_t(params[meta.key1] ? 'autosell' : 'onlynotice')})
            </Text>
          )
        }
      />
      {!stopped && (
        <DialogRef
          ref={actionSheetRef}
          title={mode === 'update' ? _t(meta.row.update) : _t(meta.row.create)}
          onOk={() => actionSheetRef.current.confirm()}
          cancelButtonProps={{ onClick: () => actionSheetRef.current.cancel() }}
          onCancel={() => actionSheetRef.current.close()}
          cancelText={_t('delete')}
          okText={_t('btnsetting')}
          size="medium"
        >
          <StopLossByRatioSheet
            onSubmit={onSubmit}
            mode={mode}
            actionSheetRef={actionSheetRef}
            params={params}
            open={open}
            taskId={taskId}
            onFresh={onFresh}
            scene={scene}
          />
        </DialogRef>
      )}
    </>
  );
};
