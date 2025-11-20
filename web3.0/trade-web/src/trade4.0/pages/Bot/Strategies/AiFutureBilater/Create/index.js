/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef } from 'react';
import Investment from 'Bot/components/Common/Investment';
import { Divider, Flex } from 'Bot/components/Widgets';
import SubmitButton from './SubmitButton';
import { FormWrapper, FormNumberInputItem, Form } from 'Bot/components/Common/CForm';
import { _t } from 'Bot/utils/lang';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import LeveragePicker from 'Bot/components/Common/LeveragePicker.js';
import OrderTab from 'Bot/components/Common/OrderTab';
import useCreateInfo from './useCreateInfo';
import useMergeState from 'Bot/hooks/useMergeState';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import { MIcons } from 'Bot/components/Common/Icon';
import LabelPopover from 'Bot/components/Common/LabelPopover';

const Custom = ({ show }) => {
  const symbolCode = useGetCurrentSymbol();
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form) ?? {};
  const { limitAsset, stopLossPercent } = values;

  const [commonSetting, setCommonSetting] = useMergeState({
    riskVersion: 0,
    leverage: 2,
  });

  const aiInfo = useCreateInfo({ symbol: symbolCode, leverage: commonSetting.leverage });
  // 卡券参数
  const [coupon, setCoupon] = useState();

  // 合并提交的参数
  const allSubmitParamsRef = useRef();
  allSubmitParamsRef.current = {
    stra: 'WIN_TWO_WAY',
    limitAsset,
    stopLossPercent,
    symbolInfo,
    ...aiInfo,
    ...commonSetting,
  };

  useUpdateLayoutEffect(() => {
    form.resetFields();
    setCommonSetting({
      leverage: 2,
    });
  }, [symbolCode]);
  return (
    <FormWrapper className="Custom" form={form}>
      <Flex vc mb={16}>
        <OrderTab
          part={1}
          mr={12}
          mb={0}
          label={_t('radical')}
          label2={_t('conservative')}
          value={commonSetting.riskVersion}
          onChange={(val) => setCommonSetting({ riskVersion: val })}
        />
        <LabelPopover
          Icon={MIcons.Question}
          content={
            <>
              <div>{_t('dDshqTe4LsjCPfZ38RYo2K')}</div>
              <p className="mb-16">{_t('7S1PjgYveUT41pKLj4Xuub')}</p>
              <p>{_t('reUdX9WLZ8B9PEB3cQyQJL')}</p>
            </>
          }
        />
      </Flex>

      <Investment
        symbol={symbolCode}
        minInvest={aiInfo.minInvestment}
        maxInvestment={aiInfo.maxInvestment}
        hasMultiCoin={false}
        rightSlot={
          <LeveragePicker
            min={1}
            max={aiInfo.maxLeverage}
            value={commonSetting.leverage}
            onChange={(val) => setCommonSetting({ leverage: val })}
            symbolCode={symbolCode}
          />
        }
      />

      <Divider />
      <AdvanceSettingWrap infoContentKeys={[['lossstop', 'aiStopLossContent2']]}>
        <FormNumberInputItem
          name="stopLossPercent"
          placeholder={_t('lossstop')}
          unit="%"
          max={99.9}
          min={0}
          maxPrecision={1}
        />
      </AdvanceSettingWrap>
      <SubmitButton
        clearCoupon={setCoupon}
        form={form}
        options={allSubmitParamsRef.current}
        type="AI"
      />
    </FormWrapper>
  );
};

export default Custom;
