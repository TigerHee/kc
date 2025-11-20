/*
 * @owner: borden@kupotech.com
 */
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { isNil, isEmpty, find } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import { useTheme } from '@emotion/react';
import { ICInfoContainOutlined } from '@kux/icons';
import moment from 'moment';
import Form from '@mui/Form';
import Radio from '@mui/Radio';
import Select from '@mui/Select';
import DatePicker from '@mui/DatePicker';
import { _t, _tHTML } from 'src/utils/lang';
import { numberFixed, multiply, separateNumber } from 'src/helper';
import useIsMobile from '@/hooks/common/useIsMobile';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import InputWithToolTip from '@/components/InputWithTooltip';
import useSensorFunc from '@/hooks/useSensorFunc';
import useAmountConfig from '../../hooks/useAmountConfig';
import {
  Label,
  StyledDialog,
  StyledTooltipWrapper,
} from './style';
import { StyledInputNumber } from '../../style';
import useSide from '../../../../hooks/useSide';
import { ADVANCED_MODEL, TIME_STRATEGY_MAP, ADVANCED_MODEL_MAP } from '../../../../config';

const { FormItem, useForm } = Form;

const _d = new Date();
_d.setHours(0);
_d.setMinutes(0);
_d.setSeconds(0);
// 取消时间默认值 00:00:00
const moment_default = moment(_d);

const AdvancedModal = React.memo((props) => {
  const { amount, memoryKey, open, onCancel, ...otherProps } = props;
  const [form] = useForm();
  const { colors } = useTheme();
  const isMobile = useIsMobile();
  const sensorFunc = useSensorFunc();
  const [showAmountError, setShowAmountError] = useState('');
  const [isShowAmountFocus, setIsShowAmountFocus] = useState(false);

  const dispatch = useDispatch();
  const { amountMin } = useAmountConfig();
  const { side } = useSide();
  const { basePrecision } = useGetCurrentSymbolInfo();
  const advanceSettings = useSelector((state) => state.tradeForm[`advanceSettings_${side}`]);

  const ph = Form.useWatch('ph', form);
  const timeStrategy = Form.useWatch('timeStrategy', form);

  const { displayUsefulLife } = TIME_STRATEGY_MAP[timeStrategy] || {};
  // const { displayShowAmount, timeStrategyOptions } = ADVANCED_MODEL_MAP[ph] || {};
  // 默认全显示
  const { displayShowAmount, timeStrategyOptions } = ADVANCED_MODEL_MAP[ph] || {
    timeStrategyOptions: ADVANCED_MODEL_MAP.Hidden.timeStrategyOptions,
  };

  useEffect(() => {
    let initValues;
    try {
      initValues = JSON.parse(window.localStorage.getItem(memoryKey));
    } catch (e) {
      console.log(`parse ${memoryKey} error`, e);
    }
    if (!isEmpty(initValues)) {
      dispatch({
        type: 'tradeForm/updateAdvanceModalData',
        payload: { settings: initValues, side },
      });
    }
  }, [side, memoryKey]);

  useEffect(() => {
    if (open) {
      const { ph: _ph, usefulLife: _usefulLife, timeStrategy: _timeStrategy, ...other } =
        advanceSettings || {};
      if (ADVANCED_MODEL_MAP[_ph]) {
        other.ph = _ph;
      }
      if (TIME_STRATEGY_MAP[_timeStrategy]) {
        other.timeStrategy = _timeStrategy;
      }
      if (_usefulLife) {
        other.usefulLife = moment(_usefulLife);
      }
      if (!isEmpty(other)) {
        form.setFieldsValue(other);
      } else {
        form.resetFields();
        setShowAmountError('');
      }
    }
  }, [open, advanceSettings]);

  // 校正订单策略选项
  useEffect(() => {
    if (!find(timeStrategyOptions, (v) => v.value === timeStrategy)) {
      form.setFieldsValue({
        timeStrategy: timeStrategyOptions?.[0]?.value,
      });
    }
  }, [timeStrategyOptions]);

  const showAmountValidator = (_, value) => {
    if ([amount, value].some((v) => isNil(v) || !+v)) {
      return Promise.resolve();
    }
    const minAmount = +numberFixed(Math.max(multiply(amount, 0.05), amountMin), basePrecision);
    if (+value > +amount || +value < minAmount) {
      return Promise.reject(
        _t('trd.advance.set.err', {
          curAmount: separateNumber(amount),
          minAmount: separateNumber(minAmount),
        }),
      );
    }
    return Promise.resolve();
  };

  // 永久保存
  const save = useCallback(() => {
    const values = form.getFieldsValue(true);
    window.localStorage.setItem(memoryKey, JSON.stringify(values));
    dispatch({
      type: 'tradeForm/updateAdvanceModalData',
      payload: {
        settings: values,
        side,
      },
    });
    if (onCancel) onCancel();
  }, [side, memoryKey, onCancel]);

  const saveOnce = useCallback(() => {
    window.localStorage.setItem(`trade_once_${side}`, true);
    save();
  }, [side, save]);

  const onFieldsChange = useCallback((field) => {
    if (field?.[0]?.name?.[0] === 'showAmount') {
      setShowAmountError(field?.[0]?.errors?.[0] || '');
    }
    if (field?.[0]?.name?.[0] === 'ph') {
      sensorFunc(['spotTrading', `advanced${field?.[0]?.value}`]);
    }
    if (field?.[0]?.name?.[0] === 'timeStrategy') {
      sensorFunc(['spotTrading', 'advancedTimeStrategy'], field?.[0]?.value);
    }
  }, []);

  return (
    <StyledDialog
      open={open}
      onOk={save}
      height="90%"
      size="medium"
      onCancel={onCancel}
      okText={_t('trd.save')}
      contentPadding="16px 16px"
      cancelText={_t('trd.save.once')}
      cancelButtonProps={{ onClick: saveOnce }}
      title={_t('trd.advance')}
      {...otherProps}
    >
      <Form form={form} onFieldsChange={onFieldsChange}>
        {/* <FormItem noStyle name="ph" initialValue={ADVANCED_MODEL[0].value}> */}
        <FormItem noStyle name="ph">
          <Radio.Group size="small">
            {ADVANCED_MODEL.map(({ label, value, tooltipTitle }) => {
              return (
                <Radio
                  key={value}
                  value={value}
                  {...(isMobile ? { onClick: (e) => e.preventDefault() } : null)}
                >
                  <StyledTooltipWrapper useUnderline title={tooltipTitle()}>
                    {label}
                  </StyledTooltipWrapper>
                </Radio>
              );
            })}
          </Radio.Group>
        </FormItem>
        {Boolean(displayShowAmount) && (
          <Fragment>
            <Label>{_t('trd.show.amount')}</Label>
            <InputWithToolTip title={isShowAmountFocus && showAmountError}>
              <FormItem
                noStyle
                initialValue={0}
                name="showAmount"
                rules={[
                  {
                    validator: showAmountValidator,
                  },
                ]}
              >
                <StyledInputNumber
                  precision={basePrecision}
                  placeholder={_t('trd.show.amount')}
                  onBlur={() => setIsShowAmountFocus(false)}
                  onFocus={() => setIsShowAmountFocus(true)}
                />
              </FormItem>
            </InputWithToolTip>
          </Fragment>
        )}
        <Fragment>
          <Label>
            <StyledTooltipWrapper useUnderline title={_tHTML('trd.advance.strategy')}>
              {_t('trd.strategy')}
            </StyledTooltipWrapper>
          </Label>
          <FormItem noStyle name="timeStrategy" initialValue={timeStrategyOptions?.[0]?.value}>
            <Select options={timeStrategyOptions} />
          </FormItem>
        </Fragment>
        {Boolean(displayUsefulLife) && (
          <Fragment>
            <Label>
              <StyledTooltipWrapper useUnderline title={_t('trd.help.time.in.force')}>
                {_t('trd.life.time')}
              </StyledTooltipWrapper>
            </Label>
            <FormItem noStyle name="usefulLife" initialValue={moment_default}>
              <DatePicker
                picker="time"
                format="HH:mm:ss"
                allowClear={false}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Fragment>
        )}
      </Form>
    </StyledDialog>
  );
});

export default AdvancedModal;
