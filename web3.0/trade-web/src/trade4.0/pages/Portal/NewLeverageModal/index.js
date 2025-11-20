/**
 * Owner: borden@kupotech.com
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import { reduce, isEmpty } from 'lodash';
import { useDebounceEffect } from 'ahooks';
import Form from '@mui/Form';
import Dialog from '@mui/Dialog';
import Alert from '@mui/Alert';
import Slider from '@mui/Slider';
import InputNumber from '@mui/InputNumber';
import { useSnackbar } from '@kux/mui/hooks';
import useMarginModel from '@/hooks/useMarginModel';
import useSensorFunc from '@/hooks/useSensorFunc';
import usePair from '@/hooks/common/usePair';
import { event } from '@/utils/event';
import { _t, _tHTML } from 'src/utils/lang';
import { formatNumber, getPrecisionFromIncrement } from 'src/helper';
import { getLeveragePoint } from 'src/components/Isolated/utils';
import { SliderWrapper, AlertWrapper, TipsBox } from './style';
import {
  STEP,
  MIN_LEVERAGE,
  ACCOUNT_TYPE_MAP,
  LEVERAGE_PRECISION,
  INIT_BORROW_AMOUNT_INFO,
} from './config';

const { FormItem, useForm } = Form;

const NewLeverageModal = React.memo((props) => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const realLeverage = useRef(0);
  const isSubmited = useRef(false);
  const { message } = useSnackbar();
  const leverage = Form.useWatch('leverage', form);

  const leverageModalConfig = useSelector(state => state.isolated.leverageModalConfig);
  const { tag, open, accountType } = leverageModalConfig;
  const {
    pullPostion,
    computeBorrowAmount,
    computeRealLeaverage,
    updateUserLeverageEffect,
    updateUserLeverageReducer,
  } = ACCOUNT_TYPE_MAP[accountType] || {};

  const confirmLoading = useSelector(
    (state) => state.loading.effects[updateUserLeverageEffect],
  );

  const [value, setValue] = useState(MIN_LEVERAGE);
  const [positionData, setPositionData] = useState();
  const [borrowAmountInfo, setBorrowAmountInfo] = useState(INIT_BORROW_AMOUNT_INFO);

  const { baseInfo, quoteInfo } = usePair(tag);
  const sensorFunc = useSensorFunc(accountType);
  const { accountConfigs } = useMarginModel(['accountConfigs'], {
    symbol: tag,
    tradeType: accountType,
  });
  const { setFieldsValue, validateFields } = form;
  const { maxLeverage = 0, riskLeverage = 0 } = accountConfigs;

  // 关键节点
  const marks = useMemo(() => {
    const result = getLeveragePoint(maxLeverage, [MIN_LEVERAGE]);
    return reduce(result, (a, b) => {
      a[b] = `${b}X`;
      return a;
    }, {});
  }, [maxLeverage]);

  useEffect(() => {
    if (open) {
      setBorrowAmountInfo(INIT_BORROW_AMOUNT_INFO);
      pullPostion({ tag }).then((res) => {
        if (res?.success) {
          setPositionData(res.data);
          changeValue(res.data.userLeverage);
          realLeverage.current = computeRealLeaverage(res.data);
        }
      });
    }
  }, [leverageModalConfig]);

  useEffect(() => {
    if (open) {
      sensorFunc(['leverageWindow', 'confirmBtn', 'expose']);
    }
  }, [open, sensorFunc]);

  useDebounceEffect(() => {
    if (open && !isEmpty(baseInfo) && !isEmpty(quoteInfo)) {
      setBorrowAmountInfo({
        a: formatNumber(
          computeBorrowAmount({
            positionData,
            userLeverage: value,
            currency: baseInfo.currency,
          }),
        ),
        b: baseInfo.currencyName,
        c: formatNumber(
          computeBorrowAmount({
            positionData,
            userLeverage: value,
            currency: quoteInfo.currency,
          }),
        ),
        d: quoteInfo.currencyName,
      });
    }
  }, [open, positionData, value, accountType, baseInfo, quoteInfo], { wait: 500 });

  const changeValue = useCallback((nextValue) => {
    setValue(nextValue);
    setFieldsValue({ leverage: nextValue });
    // setFieldsValue不会触发校验，手动调用validateFields触发
    validateFields(['leverage']);
  }, []);

  const triggerLeverageValidator = (_, val) => {
    val = +val;
    if (val < MIN_LEVERAGE) {
      return Promise.reject(
        _t('isolated.min.leverage', { multi: MIN_LEVERAGE }),
      );
    }
    if (maxLeverage && val > maxLeverage) {
      return Promise.reject(
        _t('isolated.max.leverage', { multi: maxLeverage }),
      );
    }
    if (realLeverage.current && val < realLeverage.current) {
      return Promise.reject(
        _t('multi.warning', { multi: realLeverage.current }),
      );
    }
    // 精度正确的数据才映射到滑动条，否则InputNumber会自动格式化精度
    if (getPrecisionFromIncrement(val) <= LEVERAGE_PRECISION) {
      setValue(val);
    }
    return Promise.resolve();
  };

  const onCancel = useCallback(() => {
    dispatch({
      type: 'isolated/updateLeverageModalConfig',
      payload: {
        open: false,
      },
    });
  }, []);

  const onOk = useCallback(() => {
    validateFields().then((values) => {
      if (isSubmited.current) return;
      isSubmited.current = true;
      dispatch({
        type: updateUserLeverageEffect,
        payload: {
          ...values,
          symbol: tag,
        },
      })
        .then((res) => {
          if (res && res.success) {
            message.success(_t('operation.succeed'));
            sensorFunc(['leverageWindow', 'confirmSuccess']);
            event.emit('changeLeverage.success');
            if (updateUserLeverageReducer) {
              dispatch({
                type: updateUserLeverageReducer,
                payload: {
                  tag,
                  userLeverage: values.leverage,
                },
              });
            }
            onCancel();
          }
        })
        .finally(() => {
          isSubmited.current = false;
        });
    });
  }, [accountType, tag, onCancel, sensorFunc]);

  return (
    <Dialog
      keyboard
      onOk={onOk}
      open={open}
      size="medium"
      destroyOnClose // 不销毁会导致弹窗内弹出时存在层级问题
      onCancel={onCancel}
      okText={_t('confirmed')}
      cancelText={_t('cancel')}
      title={_t('multi.setting')}
      footerProps={{ border: true }}
      okButtonProps={{ loading: confirmLoading }}
      {...props}
    >
      <AlertWrapper open={value > riskLeverage}>
        <Alert showIcon type="error" title={_t('multi.danger')} />
      </AlertWrapper>
      <Form form={form}>
        <FormItem
          name="leverage"
          rules={[{ validator: triggerLeverageValidator }]}
        >
          <InputNumber
            controls
            step={STEP}
            size="large"
            precision={LEVERAGE_PRECISION}
          />
        </FormItem>
        <SliderWrapper>
          <Slider
            step={STEP}
            marks={marks}
            value={value}
            max={maxLeverage}
            min={MIN_LEVERAGE}
            onChange={changeValue}
          />
        </SliderWrapper>
        <TipsBox>
          {_tHTML('multi.maxBorrow.tip', borrowAmountInfo)}
        </TipsBox>
      </Form>
    </Dialog>
  );
});

export default NewLeverageModal;
