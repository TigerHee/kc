/**
 * Owner: mike@kupotech.com
 */
// 配置文件
import React, { useState } from 'react';
import { useModel } from '../model';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import AsyncValidator from 'async-validator';
import Decimal from 'decimal.js/decimal';
import { getCircleChoice } from 'FutureMartingale/config';
import { updateBotParams } from 'FutureMartingale/services';
import { getBuyAfterFallLabel } from 'FutureMartingale/util';
import { isNull, formatNumber, floatText } from 'Bot/helper';
import { isRTLLanguage } from 'utils/langTools';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import styled from '@emotion/styled';
import { Text, Flex, Div } from 'Bot/components/Widgets';
import OpenUnitPriceTemp from 'FutureMartingale/components/OpenUnitPriceTemp';
import CircularOpeningConditionTemp from 'FutureMartingale/components/CircularOpeningConditionTemp';
import OpenPriceRangeTemp from 'FutureMartingale/components/OpenPriceRangeTemp';

// 以下是高级设置
// 首轮开仓条件
const OpenUnitPrice = ({ formKey, sheetRef }) => {
  const model = useModel();
  const { formData } = model;
  const validator = (rule, value, cb) => {
    if (!isNull(value)) {
      value = Number(value);
      if (value === 0) {
        return cb(_t('gridform8'));
      }
      // 需小于{price}
      if (formData.direction === 'long') {
        if (value > formData.price) {
          return cb(
            _t('kfBLf9CJ5mVBTwQYDApJ2U', {
              price: formatNumber(formData.price),
            }),
          );
        }
      }
      // 需大于{price}
      if (formData.direction === 'short') {
        if (value < formData.price) {
          return cb(
            _t('6hAr1ce2jjhmCVnXJgNA5r', {
              price: formatNumber(formData.price),
            }),
          );
        }
      }
    }
    cb();
  };
  return (
    <OpenUnitPriceTemp formKey={formKey} sheetRef={sheetRef} model={model} validator={validator} />
  );
};

/**
 * @description: 循环开仓条件
 * @param {*} props
 * @return {*}
 */
const CircularOpeningCondition = (props) => {
  return <CircularOpeningConditionTemp model={useModel()} {...props} />;
};

/**
 * @description: 开仓价格区间
 * @param {*} Form
 * @param {*} sheetRef
 * @return {*}
 */
export const OpenPriceRange = ({ sheetRef }) => {
  const [form] = Form.useForm();
  const { minPrice, maxPrice } = Form.useWatch([], form) ?? {};
  const model = useModel();
  const { formData = {}, formRequired: required } = model;
  const { stopLossPrice, amount } = formData;
  const minPriceValidator = (rule, value, cb) => {
    if (!isNull(value)) {
      if (Number(value) === 0) {
        return cb(_t('gridform8'));
      }
      // 区间下限≤触发价格≤开仓价格区间上限
      if (amount) {
        if (Decimal(value).greaterThanOrEqualTo(amount)) {
          cb(_t('kfBLf9CJ5mVBTwQYDApJ2U', { price: amount }));
        }
      }
      if (maxPrice) {
        if (Decimal(value).greaterThanOrEqualTo(maxPrice)) {
          cb(_t('kfBLf9CJ5mVBTwQYDApJ2U', { price: maxPrice }));
        }
      }
      if (stopLossPrice) {
        if (Decimal(value).lessThanOrEqualTo(stopLossPrice)) {
          cb(_t('6hAr1ce2jjhmCVnXJgNA5r', { price: stopLossPrice }));
        }
      }
    }
    if (required) {
      if (!value) {
        return cb(_t('p3mvWJvAAjs5hncthUKrJJ'));
      }
    }
    cb();
  };
  const maxPriceValidator = (rule, value, cb) => {
    if (!isNull(value)) {
      if (Number(value) === 0) {
        return cb(_t('gridform8'));
      }
      // 区间下限≤触发价格≤开仓价格区间上限
      if (amount) {
        if (Decimal(value).lessThanOrEqualTo(amount)) {
          cb(_t('6hAr1ce2jjhmCVnXJgNA5r', { price: amount }));
        }
      }
      if (minPrice) {
        if (Decimal(value).lessThanOrEqualTo(minPrice)) {
          cb(_t('6hAr1ce2jjhmCVnXJgNA5r', { price: minPrice }));
        }
      }
    }
    // if (required) {
    //   if (!value) {
    //     return cb(_t('p3mvWJvAAjs5hncthUKrJJ'));
    //   }
    // }
    cb();
  };

  return (
    <OpenPriceRangeTemp
      form={form}
      sheetRef={sheetRef}
      model={model}
      minPriceValidator={minPriceValidator}
      maxPriceValidator={maxPriceValidator}
    />
  );
};

// 做多: 现价＊(1-价格跌多少加仓＊最大加仓次数/100)
// 做空: 现价＊(1-价格跌多少加仓＊最大加仓次数/100)
const getStoplossLimit = (formData) => {
  const { price, buyAfterFall, buyTimes, direction } = formData;
  if (!price || !buyAfterFall || !buyTimes) return 0;
  const firstLevel = Decimal(buyAfterFall).times(buyTimes).div(100);
  const temp = direction === 'long' ? Decimal(1).sub(firstLevel) : Decimal(1).add(firstLevel);
  return Decimal(price).times(temp).toFixed(12, Decimal.ROUND_DOWN);
};

const stoplossValidCFG = ({ symbolInfo, formData }) => {
  const { pricePrecision, quota } = symbolInfo;
  const { minPrice, maxPrice, direction } = formData;
  const limit = getStoplossLimit(formData);
  const CFG = {
    0: {
      maxPrecision: pricePrecision,
      validator: (rule, value, cb) => {
        if (!isNull(value)) {
          if (Number(value) === 0) {
            return cb(_t('gridform8'));
          }
          if (direction === 'long') {
            if (minPrice) {
              if (Decimal(value).greaterThanOrEqualTo(minPrice)) {
                cb(_t('kfBLf9CJ5mVBTwQYDApJ2U', { price: minPrice }));
              }
            } else if (limit) {
              if (Decimal(value).greaterThanOrEqualTo(limit)) {
                cb(_t('kfBLf9CJ5mVBTwQYDApJ2U', { price: formatNumber(limit, pricePrecision) }));
              }
            }
          }
          if (direction === 'short') {
            if (maxPrice) {
              if (Decimal(value).lessThanOrEqualTo(maxPrice)) {
                cb(_t('6hAr1ce2jjhmCVnXJgNA5r', { price: maxPrice }));
              }
            } else if (limit) {
              if (Decimal(value).lessThanOrEqualTo(limit)) {
                cb(_t('6hAr1ce2jjhmCVnXJgNA5r', { price: formatNumber(limit, pricePrecision) }));
              }
            }
          }
        }
        cb();
      },
      unit: quota,
      submitKey: 'stopLossPrice',
    },
    1: {
      maxPrecision: 1,
      validator: (rule, value, cb) => {
        if (!isNull(value)) {
          value = Number(value);
          if (value === 0) {
            return cb(_t('gridform8'));
          }
        }

        cb();
      },
      unit: '%',
      submitKey: 'stopLossPercent',
    },
  };
  return CFG;
};

// 止损
export const Stoploss = ({ formKey, sheetRef }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form) ?? {};
  const { formData, setMergeState, symbolInfo } = useModel();
  // 获取之前的数据
  const [tab, setTab] = useState(1);
  // 获取不同tab 对应的校验数据
  const CFG = stoplossValidCFG.call(null, {
    symbolInfo,
    formData,
  });
  const onCancel = () => {
    setMergeState({
      stopLossPrice: '',
      stopLossPercent: '',
    });
    sheetRef.current.close();
  };
  const currentSubmitKey = CFG[tab].submitKey;
  const onSubmit = async () => {
    try {
      const results = await form.validateFields([currentSubmitKey]);
      setMergeState({
        stopLossPrice: '',
        stopLossPercent: '',
        [currentSubmitKey]: values[currentSubmitKey],
      });
      sheetRef.current.close();
    } catch (error) {
      console.log(error);
    }
  };
  useBindDialogButton(sheetRef, {
    onConfirm: onSubmit,
    onCancel,
  });
  return (
    <Form
      form={form}
      initialValues={{
        stopLossPercent: formData.stopLossPercent,
      }}
    >
      <Text fs={14} color="text40" lh="130%" as="div" mb={8}>
        {_t('percent')}
      </Text>
      <FormItem
        name="stopLossPercent"
        rules={[
          {
            validator: CFG[1].validator,
          },
        ]}
      >
        <InputNumber
          unit={CFG[1].unit}
          max={99}
          min={0}
          id="martingale-stopLossPercent"
          autoFixPrecision
          autoFixMinOnBlur
          maxPrecision={CFG[1].maxPrecision}
        />
      </FormItem>
    </Form>
  );
};
// 以上是高级设置

export const titleConfig = {
  buyAfterFall: {
    title: 'scSeoCrFZn2xtbTLLVhzbH', // 弹窗标题
    // 做多 价格跌多少加仓/做空 价格涨多少加仓
    label: (formData) => getBuyAfterFallLabel(formData.direction),
    getUnit: () => '%', // %显示的单位
    getHint: (formData) => {
      // 显示placeholder
      const min = +formData.minBuyAfterFall;
      const max = +formData.maxBuyAfterFall;
      if (!min || !max) return '';
      const placeholder = `${min} ~ ${max}`;
      const placeholderRight = `${floatText(min)} ~ ${floatText(max)}`;
      return {
        placeholderRight,
        placeholder,
        min,
        max,
      };
    },
    form: {
      // 表单信息校验
      required: true, // 标记是必填参数
      precision: 1,
    },
  },
  buyTimes: {
    title: 'aJ1yfUGXxw4C81FDYBW8Mm',
    label: 'aJ1yfUGXxw4C81FDYBW8Mm',
    getUnit: () => '',
    getHint: (formData) => {
      const min = +formData.minBuyTimes;
      const max = +formData.maxBuyTimes;
      if (!min || !max) return '';
      const placeholder = `${min} ~ ${max}`;
      return {
        placeholder,
        min,
        max,
      };
    },
    changeFetch: true, // 值变化发起请求
    form: {
      required: true,
      onlyInteger: true,
    },
  },
  buyMultiple: {
    title: '9Soj8pxepbL1a8gov36Ykk',
    label: '9Soj8pxepbL1a8gov36Ykk',
    getUnit: () => 'x',
    getHint: (formData) => {
      const min = +formData.minBuyMultiple;
      const max = +formData.maxBuyMultiple;
      if (!min || !max) return '';
      const placeholder = `${min} ~ ${max}`;
      const placeholderRight = isRTLLanguage() ? `${max}x ~ ${min}x` : `${min}x ~ ${max}x`;
      return {
        placeholder,
        placeholderRight,
        min,
        max,
      };
    },
    changeFetch: true, // 值变化发起请求
    form: {
      required: true,
      precision: 1,
    },
  },
  stopProfitPercent: {
    title: 'c2mby2vVJSB48j4k73saca',
    label: 'c2mby2vVJSB48j4k73saca',
    getUnit: () => '%', // %
    getHint: (formData) => {
      const min = +formData.minStopProfitPercent;
      const max = +formData.maxStopProfitPercent;
      if (!min || !max) return '';
      const placeholder = `${min} ~ ${max}`;
      const placeholderRight = `${floatText(min)} ~ ${floatText(max)}`;
      return {
        placeholder,
        placeholderRight,
        min,
        max,
      };
    },
    form: {
      required: true,
      precision: 1,
    },
  },
  openUnitPrice: {
    title: 'p36PVMDHJnGYexgBmLgrvN',
    cancelText: 'machinecopydialog7', //  只有这个是cancel
    InputSheet: OpenUnitPrice,
    show: ({ formData, symbolInfo }) => {
      // 格式化显示value
      return !formData.openUnitPrice
        ? _t('startnow')
        : `${
            formData.openUnitPrice ? formatNumber(formData.openUnitPrice, symbolInfo.precision) : ''
          } ${symbolInfo.quota}`;
    },
  },
  circularOpeningCondition: {
    title: 'rTsH2BV1bbEsPXqZxwNscA',
    Dropdown: CircularOpeningCondition,
    show: ({ formData }) => {
      return getCircleChoice(formData);
    },
  },
  openPriceRange: {
    title: 'g7VQsQSvnwTQ19cKnCM1ip',
    InputSheet: OpenPriceRange,
    show: ({ formData, symbolInfo }) => {
      const { minPrice, maxPrice } = formData;
      if (isNull(minPrice) && isNull(maxPrice)) {
        // 未设置
        return _t('robotparams7');
      }
      const min = minPrice ? formatNumber(minPrice, symbolInfo.precision) : '';
      const max = maxPrice ? formatNumber(maxPrice, symbolInfo.precision) : '';
      return `${min} ~ ${max} ${symbolInfo.quota ?? ''}`;
    },
  },
  stoploss: {
    title: 'lossstop',
    InputSheet: Stoploss,
    show: ({ formData, symbolInfo }) => {
      const { stopLossPercent, stopLossPrice } = formData;
      if (isNull(stopLossPercent) && isNull(stopLossPrice)) {
        // 未设置
        return _t('robotparams7');
      }
      if (stopLossPercent) {
        return floatText(stopLossPercent);
      }
      if (stopLossPrice) {
        return `${formatNumber(stopLossPrice, symbolInfo.precision)} ${symbolInfo.quota}`;
      }
      return '';
    },
  },
};
export const InputSheetWrap = (props) => {
  const { sheetRef, formKey } = props;
  const { title, cancelText, InputSheet } = titleConfig[formKey];
  return (
    <DialogRef
      ref={sheetRef}
      title={_t(title)}
      okText={_t('gridwidget6')}
      cancelText={_t(cancelText ?? 'delete')}
      onOk={() => sheetRef.current.confirm()}
      onCancel={() => sheetRef.current.close()}
      cancelButtonProps={{ onClick: () => sheetRef.current.cancel() }}
      size="medium"
    >
      <InputSheet {...props} />
    </DialogRef>
  );
};
/**
 * @description: 获取row value 显示
 * @param {*} formKey
 * @return {JSXNode}
 */
export const getLabelShow = (formKey) => {
  return titleConfig[formKey]?.show;
};
/**
 * @description: 校验表单
 * @param {*} formData
 * @param {*} symbolInfo
 * @return {*}
 */
export const validator = async ({ formData, symbolInfo, hasToast = true }) => {
  const errMsg = {};
  let { openUnitPrice, minPrice, maxPrice } = formData;
  const { buyAfterFall, buyTimes } = formData;
  minPrice = +minPrice;
  maxPrice = +maxPrice;
  openUnitPrice = +openUnitPrice;

  if (buyAfterFall && buyTimes) {
    if (Decimal(buyAfterFall).times(buyTimes).toNumber() >= 100) {
      // hasToast && toast(_t('fHKRbvbvbVQ7VpVryWdLhF'), 1.5);
      return Promise.reject(errMsg);
    }
  }

  if (openUnitPrice) {
    if (minPrice && minPrice > openUnitPrice) {
      // hasToast && toast(_t('pdoJVf1BxQjnzdFvABF2mZ'), 1.5);
      return Promise.reject(errMsg);
    }
    if (maxPrice && maxPrice < openUnitPrice) {
      // hasToast && toast(_t('pdoJVf1BxQjnzdFvABF2mZ'), 1.5);
      return Promise.reject(errMsg);
    }
  }
  return Promise.resolve();
};

/**
 * @description: 不使用context传递数据修改; 运行中使用
 * @param {*} sheetRef 调用ref
 * @param {*} item 元数据
 * @param {*} symbolInfo 精度信息
 * @param {*} onFresh 修改成功后刷新函数
 * @return {*}
 */
export const UpdateOpenPriceRangeSheet = ({ sheetRef, item, symbolInfo, onFresh }) => {
  const model = {
    setMergeState: (params) => {
      updateBotParams({
        taskId: item.id,
        ...params,
      }).then(() => {
        sheetRef.current.close();
        // toast(_t('runningdetail'));
        onFresh();
      });
    },
    formData: { price: item.price },
    symbolInfo,
    hasDelete: false,
    formRequired: true,
  };
  return <InputSheetWrap formKey="openPriceRange" sheetRef={sheetRef} model={model} />;
};
const formKeys = ['buyAfterFall', 'buyTimes', 'buyMultiple', 'stopProfitPercent', 'limitAsset'];
/**
 * @description: 脱离UI教研 buyAfterFall，buyTimes， buyMultiple，stopProfitPercent，limitAsset四个参数，
 * 其余高级参数，因为只要设置了，都是合法的，所以不校验了
 * @return {*}
 */
export const validateBeforeFetchOverview = ({ formData, balance }) => {
  const descriptor = {
    symbol: {
      required: true,
    },
    limitAsset: {
      required: true,
      type: 'number',
      min: Math.max(formData.defaultLimitAsset || 0, formData.minLimitAsset || 0),
      max: Math.min(formData.maxLimitAsset, balance.quotaAmount),
    },
  };
  formKeys.slice(0, -1).forEach((formKey) => {
    const range = titleConfig[formKey].getHint(formData);
    descriptor[formKey] = {
      ...range,
      required: true,
      type: 'number',
    };
  });
  //  转数字
  const FormData = { ...formData };
  formKeys.forEach((key) => {
    FormData[key] = Number(formData[key]);
  });
  const schema = new AsyncValidator(descriptor);
  return schema.validate(FormData, (errors, fields) => {
    if (!errors) {
      // 业务其他校验
      return validator({ formData, hasToast: false });
    }
  });
};
