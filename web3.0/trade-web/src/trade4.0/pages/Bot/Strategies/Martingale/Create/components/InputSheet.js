/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import { useModel } from '../model.js';
import Decimal from 'decimal.js';
import { isNull, floatText, formatNumber } from 'Bot/helper';
import AsyncValidator from 'async-validator';
import { isRTLLanguage } from 'utils/langTools';
import OpenUnitPriceTemp, {
  MRadioGroup,
  MRadio,
} from 'FutureMartingale/components/OpenUnitPriceTemp';
import CircularOpeningConditionTemp from 'FutureMartingale/components/CircularOpeningConditionTemp';
import OpenPriceRangeTemp from 'FutureMartingale/components/OpenPriceRangeTemp';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import { choice } from 'FutureMartingale/config';
import { updateBotParams } from 'Martingale/services';
import { T } from 'Bot/utils/request';

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
      if (value > formData.price) {
        return cb(
          _t('kfBLf9CJ5mVBTwQYDApJ2U', {
            price: formatNumber(formData.price),
          }),
        );
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

// 开仓价格区间
export const OpenPriceRange = ({ sheetRef, isParamsPage }) => {
  const [form] = Form.useForm();
  const { minPrice, maxPrice } = Form.useWatch([], form) ?? {};
  const model = useModel();
  const { formData = {} } = model;
  const { stopLossPrice } = formData;
  const minPriceValidator = (rule, value, cb) => {
    if (!isNull(value)) {
      if (Number(value) === 0) {
        return cb(_t('gridform8'));
      }
      if (maxPrice) {
        if (Decimal(value).greaterThanOrEqualTo(maxPrice)) {
          cb(_t('kfBLf9CJ5mVBTwQYDApJ2U', { price: maxPrice }));
        }
      }
      if (stopLossPrice) {
        if (Decimal(value).lessThanOrEqualTo(stopLossPrice)) {
          cb(
            _t('6hAr1ce2jjhmCVnXJgNA5r', {
              price: stopLossPrice,
            }),
          );
        }
      }
    }
    cb();
  };
  const maxPriceValidator = (rule, value, cb) => {
    if (!isNull(value)) {
      if (Number(value) === 0) {
        return cb(_t('gridform8'));
      }
      if (minPrice) {
        if (Decimal(value).lessThanOrEqualTo(minPrice)) {
          cb(_t('6hAr1ce2jjhmCVnXJgNA5r', { price: minPrice }));
        }
      }
    }
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

const getPrevValue = ({ stopLossPrice, stopLossPercent, price }) => {
  if (stopLossPercent) {
    return {
      tab: 1,
      key: 'stopLossPercent',
      init: stopLossPercent || '',
    };
  }
  if (stopLossPrice) {
    return {
      tab: 0,
      key: 'stopLossPrice',
      init: stopLossPrice || price,
    };
  }

  return {
    tab: 1,
    key: 'stopLossPercent',
    init: stopLossPercent || '',
  };
};
// 现价＊(1-价格跌多少加仓＊最大加仓次数/100)
const stoplossShouldLow = (formData) => {
  const { price, buyAfterFall, buyTimes } = formData;
  if (!price || !buyAfterFall || !buyTimes) return 0;
  const temp = Decimal(1).sub(Decimal(buyAfterFall).times(buyTimes).div(100));
  return Decimal(price).times(temp).toFixed(12, Decimal.ROUND_DOWN);
};
const stoplossValidCFG = ({ symbolInfo, formData }) => {
  const { pricePrecision, priceIncrement, quota } = symbolInfo;
  const { minPrice } = formData;
  const limitLower = stoplossShouldLow(formData);
  const CFG = {
    0: {
      maxPrecision: pricePrecision,
      priceIncrement,
      validator: (rule, value, cb) => {
        if (!isNull(value)) {
          if (Number(value) === 0) {
            return cb(_t('gridform8'));
          }
          if (minPrice) {
            if (Decimal(value).greaterThanOrEqualTo(minPrice)) {
              cb(_t('kfBLf9CJ5mVBTwQYDApJ2U', { price: `${minPrice} ${quota}` }));
            }
          } else if (limitLower) {
            if (Decimal(value).greaterThanOrEqualTo(limitLower)) {
              cb(
                _t('kfBLf9CJ5mVBTwQYDApJ2U', {
                  price: formatNumber(limitLower, pricePrecision),
                }),
              );
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
export const Stoploss = ({ formKey, sheetRef, isParamsPage }) => {
  const [form] = Form.useForm();
  const { formData, setMergeState, symbolInfo } = useModel(isParamsPage);
  // 获取之前的数据
  const prevValue = getPrevValue(formData);
  const [tab, setTab] = useState(prevValue.tab);
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
        [currentSubmitKey]: results[currentSubmitKey],
      });
      sheetRef.current.close();
    } catch (error) {
      console.log(error);
    }
  };
  const setTabHandle = (e) => {
    e = +e.target.value;
    form.resetFields();
    setTab(e);
  };
  useBindDialogButton(sheetRef, {
    onConfirm: onSubmit,
    onCancel,
  });
  return (
    <Form
      form={form}
      initialValues={{
        stopLossPrice: formData.stopLossPrice,
        stopLossPercent: formData.stopLossPercent,
      }}
    >
      <MRadioGroup value={tab} onChange={setTabHandle} className="mb-24">
        <MRadio value={0}>
          <span>{_t('gridwidget13')}</span>
          <FormItem name="stopLossPrice" rules={[{ validator: CFG[0].validator }]}>
            <InputNumber
              unit={CFG[0].unit}
              min={0}
              maxPrecision={CFG[0].maxPrecision}
              step={CFG[0].priceIncrement}
              placeholder={formData.price}
              disabled={tab === 1}
            />
          </FormItem>
        </MRadio>
        <MRadio value={1}>
          <span>{_t('percent')}</span>
          <FormItem name="stopLossPercent" rules={[{ validator: CFG[1].validator }]}>
            <InputNumber
              unit={CFG[1].unit}
              max={99}
              min={0}
              autoFixPrecision
              autoFixMinOnBlur
              maxPrecision={CFG[1].maxPrecision}
              disabled={tab === 0}
            />
          </FormItem>
        </MRadio>
      </MRadioGroup>
    </Form>
  );
};

export const titleConfig = {
  buyAfterFall: {
    title: 'rjtTsZTWM5bqh7Rzmbr4Gt', // 弹窗标题
    label: 'rjtTsZTWM5bqh7Rzmbr4Gt', // label 名字
    getUnit: () => '%', // 显示的单位
    getHint: (formData) => {
      // 显示placeholder
      const min = +formData.minBuyAfterFall;
      const max = +formData.maxBuyAfterFall;
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
    getUnit: () => '%',
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
    hintKey: 'p36PVMDHJnGYexgBmLgrvN',
    show: ({ formData, symbolInfo }) => {
      // 格式化显示value
      return !formData.openUnitPrice
        ? _t('startnow')
        : `${formData.openUnitPrice ? formatNumber(formData.openUnitPrice) : ''} ${
            symbolInfo.quota
          }`;
    },
  },
  circularOpeningCondition: {
    title: 'rTsH2BV1bbEsPXqZxwNscA',
    Dropdown: CircularOpeningCondition,
    show: ({ formData }) => {
      const meta = choice().find((el) => el.value === formData.circularOpeningCondition);
      return meta?.lang;
    },
  },
  openPriceRange: {
    title: 'g7VQsQSvnwTQ19cKnCM1ip',
    InputSheet: OpenPriceRange,
    hintKey: 'g7VQsQSvnwTQ19cKnCM1ip',
    show: ({ formData, symbolInfo }) => {
      const { minPrice, maxPrice } = formData;
      if (isNull(minPrice) && isNull(maxPrice)) {
        // 未设置
        return _t('robotparams7');
      }
      const min = minPrice ? formatNumber(minPrice, symbolInfo.pricePrecision) : '';
      const max = maxPrice ? formatNumber(maxPrice, symbolInfo.pricePrecision) : '';
      return `${min} ~ ${max} ${symbolInfo.quota}`;
    },
  },
  stoploss: {
    title: 'lossstop',
    InputSheet: Stoploss,
    hintKey: 'lossstop',
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
        return `${formatNumber(stopLossPrice, symbolInfo.pricePrecision)} ${symbolInfo.quota}`;
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
  const { buyAfterFall, buyTimes } = formData;
  let { openUnitPrice, minPrice, maxPrice } = formData;
  minPrice = +minPrice;
  maxPrice = +maxPrice;
  openUnitPrice = +openUnitPrice;

  if (buyAfterFall && buyTimes) {
    if (Decimal(buyAfterFall).times(buyTimes).toNumber() >= 100) {
      hasToast && T.throttleMessage(_t('fHKRbvbvbVQ7VpVryWdLhF'));
      return Promise.reject(_t('fHKRbvbvbVQ7VpVryWdLhF'));
    }
  }

  if (openUnitPrice) {
    if (minPrice && minPrice > openUnitPrice) {
      hasToast && T.throttleMessage(_t('pdoJVf1BxQjnzdFvABF2mZ'));
      return Promise.reject(_t('pdoJVf1BxQjnzdFvABF2mZ'));
    }
    if (maxPrice && maxPrice < openUnitPrice) {
      hasToast && T.throttleMessage(_t('pdoJVf1BxQjnzdFvABF2mZ'));
      return Promise.reject(_t('pdoJVf1BxQjnzdFvABF2mZ'));
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
export const getDescriptor = ({ formData, balance }) => {
  const descriptor = {
    symbol: {
      required: true,
      type: 'string',
      isMinvestParams: true, // 最小投资额依赖的参数
    },
    limitAsset: {
      required: false,
      type: 'number',
      min: Math.max(formData.defaultLimitAsset || 0, formData.minLimitAsset || 0),
      max: Math.min(formData.maxLimitAsset, balance.quotaAmount),
    },
    stopLossPercent: {
      required: false,
      // type: 'number',
      min: 0,
      max: 100,
    },
    stopLossPrice: {
      required: false,
      // type: 'number',
      min: 0,
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
  return descriptor;
};
/**
 * @description: 获取发起当前委托的变化key, 作为依赖监听
 * @param {*} formData
 * @param {*} balance
 * @return {*}
 */
export const getDescriptorKeysWatcher = ({ formData, balance }) => {
  const keys = Object.keys(getDescriptor({ formData, balance }));
  return keys.map((key) => formData[key]);
};
/**
 * @description: 发起最小投资额度接口前的, 校验
 * @param {*} formData
 * @param {*} balance
 * @return {*}
 */
export const validateMinvestParams = ({ formData, balance }) => {
  const descriptor = getDescriptor({ formData, balance });
  // 过滤出只是isMinvestParams
  for (const key in descriptor) {
    if (!descriptor[key].isMinvestParams) {
      delete descriptor[key];
    }
  }
  const schema = new AsyncValidator(descriptor);
  return schema.validate(formData);
};
/**
 * @description: 脱离UI教研 buyAfterFall，buyTimes， buyMultiple，stopProfitPercent，limitAsset四个参数，
 * 其余高级参数，因为只要设置了，都是合法的，所以不校验了
 * @return {*}
 */
export const validateBeforeFetchOverview = ({ formData, balance }) => {
  const descriptor = getDescriptor({ formData, balance });
  //  转数字
  const FormData = { ...formData };
  formKeys.forEach((key) => {
    FormData[key] = Number(formData[key]);
  });
  const schema = new AsyncValidator(descriptor);
  return new Promise((r, j) => {
    schema.validate(FormData, async (errors, fields) => {
      const runValidator = async () => {
        try {
          const result = await validator({ formData, hasToast: false });
          r(result);
        } catch (error) {
          j(error);
        }
      };

      if (!errors) {
        // 业务其他校验
        await runValidator({ formData, hasToast: false });
      } else {
        // 不对资产做强校验
        // eslint-disable-next-line no-lonely-if
        if (errors.length === 1 && errors[0].field === 'limitAsset') {
          await runValidator({ formData, hasToast: false });
        } else {
          j(errors);
        }
      }
    });
  });
};
