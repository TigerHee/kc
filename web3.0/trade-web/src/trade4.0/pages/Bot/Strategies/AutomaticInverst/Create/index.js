/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Form, FormWrapper, FormNumberInputItem } from 'Bot/components/Common/CForm';
import Select from '@mui/Select';
import { Divider, Text } from 'Bot/components/Widgets';
import { INVERSTCYCLE, getInverstMax, NOW } from '../config';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import ProfitTarget from '../components/ProfitTarget';
import DayOfWeek from '../components/DayOfWeek';
import FirstOrderDate from '../components/FirstOrderDate';
import { isEmpty } from 'lodash';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import useMergeState from 'Bot/hooks/useMergeState';
import { getCurrentDayOfWeek, formatFirstTimeInvest } from '../util';
import { _t } from 'Bot/utils/lang';
import { times100 } from 'Bot/helper';
import SubmitButton from '../components/SubmitButton';
import Investment from 'Bot/components/Common/Investment/index.js';
import LabelPopover from 'Bot/components/Common/LabelPopover';

const { FormItem, useForm } = Form;

const dftInterval = 'D1';
const maxTotalCostLimit = 50000000;

// 处理排行榜数据复制到自定义
// export const useCopyParams = ({ form, setFormData, advanceRef }) => {
//   const dispatch = useDispatch();
//   const copyParams = useSelector((state) => state.automaticinverst.copyParams);
//   useLayoutEffect(() => {
//     if (!isEmpty(copyParams)) {
//       const { interval, profitTarget } = copyParams;
//       form.setFieldsValue({
//         interval,
//       });
//       setFormData({ profitTarget: times100(profitTarget) });
//       advanceRef.current?.setOpen(true);

//       //  清空参数
//       dispatch({
//         type: 'automaticinverst/update',
//         payload: {
//           copyParams: {},
//         },
//       });
//     }
//   }, [advanceRef, copyParams, dispatch, form, setFormData]);
// };

export default ({ isActive }) => {
  const [form] = useForm();

  const { resetFields } = form;

  const dispatch = useDispatch();
  const advanceRef = useRef();

  const minInvestMap = useSelector((state) => state.automaticinverst.minInvestMap);
  const currentSymbol = useGetCurrentSymbol();

  const symbolInfo = useSpotSymbolInfo(currentSymbol);
  const { quota } = symbolInfo || {};

  const canInputMax = getInverstMax(currentSymbol);

  const interval = Form.useWatch('interval', form);
  const dayOfWeek = Form.useWatch('dayOfWeek', form);
  const amount = Form.useWatch('amount', form);
  const maxTotalCost = Form.useWatch('maxTotalCost', form);

  const [formData, setFormData] = useMergeState({
    profitTarget: 10,
    isTargetSellBase: 0,
    stra: 'AIP',
    createWay: 'Custom',
    coupon: null,
    executeTime: [NOW],
  });

  const allFormData = {
    symbolInfo,
    symbol: currentSymbol,
    amount: amount || 10,
    minInvest: minInvestMap?.[currentSymbol] || 1, // 最小投资额
    interval: interval ? [interval] : [dftInterval],
    dayOfWeek,
    maxTotalCost: maxTotalCost || undefined,
    ...formData,
  };

  const maxTotalCostValidator = async (rule, value) => {
    // 有输入的逻辑
    let msg = '';
    value = +value;
    if (value === 0) {
      msg = _t('auto.enteruplimit');
    }
    if (amount > 0 && value > 0 && value < amount) {
      msg = _t('auto.ivstuplmitshouldmore', { num: amount });
    }
    if (value > maxTotalCostLimit) {
      msg = _t('auto.ivstuplmitshouldless');
    }

    if (msg) {
      return Promise.reject(msg);
    }
    return Promise.resolve();
  };

  const clearCoupon = useCallback(() => {
    setFormData({ coupon: null });
  }, [setFormData]);
  const setCoupon = useCallback(
    (coupon) => {
      setFormData({ coupon });
    },
    [setFormData],
  );

  // 交易对变化重置表单
  useLayoutEffect(() => {
    resetFields();
    dispatch({
      type: 'automaticinverst/getMinInvest',
      payload: currentSymbol,
    });
  }, [currentSymbol]);

  // useCopyParams({ form, setFormData, advanceRef });

  return (
    <>
      <FormWrapper
        form={form}
        initialValues={{
          interval: dftInterval,
          dayOfWeek: getCurrentDayOfWeek(),
        }}
      >
        {/* 定投频率 */}
        <Text color="text" fs="14" lh="130%" mb={8} as="div" mt={16}>
          {_t('auto.whentoinverst')}
        </Text>
        <FormItem noStyle name="interval">
          <Select allowSearch searchIcon={false} emptyContent options={INVERSTCYCLE()} />
        </FormItem>

        {/* 定投日 */}
        <DayOfWeek type="create" value={allFormData} />
        {/* 首次下单时间 */}
        <FirstOrderDate type="create" value={allFormData} onChange={setFormData} />
        <Divider />
        {/* 投资额度 */}
        <Investment
          label={
            <LabelPopover label={_t('auto.perinvertmuch')} content={_t('7DLSWtMiAoBxUCp9BQoxWW')} />
          }
          minInvest={allFormData.minInvest}
          maxInvestment={canInputMax}
          symbol={currentSymbol}
          hasMultiCoin={false}
          hasGridInvest={false}
          formKey="amount"
        />

        <Divider />

        <AdvanceSettingWrap>
          {/* 定投上限 */}
          <FormNumberInputItem
            className="mb-10"
            name="maxTotalCost"
            validator={maxTotalCostValidator}
            placeholder={_t('auto.inverstuplimit')}
            unit={quota}
          />
          {/* 盈利目标 */}
          <ProfitTarget onChange={setFormData} f value={formData} />
        </AdvanceSettingWrap>

        <SubmitButton allFormData={allFormData} clearCoupon={clearCoupon} form={form} />
        <Text as="div" color="text40" fs="12">
          {_t('firsttimeinvest')}: {formatFirstTimeInvest(allFormData)}
        </Text>
      </FormWrapper>
    </>
  );
};
