/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import Investment from 'Bot/components/Common/Investment/index.js';
import { Divider, Text } from 'Bot/components/Widgets';
import SubmitButton from './SubmitButton';
import { useSymbolChange } from 'ClassicGrid/Create/hook';
import { _t, _tHTML } from 'Bot/utils/lang';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import Row from 'Bot/components/Common/Row';
import LabelPopover from 'Bot/components/Common/LabelPopover';
import { MIcons } from 'Bot/components/Common/Icon';
import useCreateInfo from './useCreateInfo';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import useLastTradedPrice from 'Bot/hooks/useLastTradedPrice';
import { formatNumber } from 'Bot/helper';

const SettingRows = React.memo(({ aiInfo, quota }) => {
  const { min, max, gridNum } = aiInfo;
  const quotaText = quota ? `(${quota})` : '';
  const range = Number(min) && Number(max) ? `${formatNumber(min)}～${formatNumber(max)}` : '--';

  return (
    <div>
      <Text fs={14} color="text" fw={500} lh="130%" mb={8} mt={16} as="div">
        {_t('76RRv418Q2eESJ2LGohsgo')}
      </Text>
      <Row
        fs={12}
        mb={8}
        labelColor="text40"
        label={`${_t('eGuAzJK7p1ztjs3XD8FqPx')}${quotaText}`}
        value={range}
      />
      <Row
        fs={12}
        mb={8}
        labelColor="text40"
        label={_t('qVHGeEEEKtbkeyp1Y5tmmD')}
        value={gridNum || '--'}
      />
      <Row
        fs={12}
        labelColor="text40"
        label={
          <LabelPopover
            textProps={{ color: 'text40', fs: 12 }}
            Icon={MIcons.Question}
            label={_t('ceKb5AFY7BnmumCxsKpJ4b')}
            content={_t('bgDzqPo1QJkQBdvGkVD5dQ')}
          />
        }
        value={<MIcons.Hook size={16} color="primary" />}
      />
    </div>
  );
});

const Auto = React.memo(({ show }) => {
  const symbolCode = useGetCurrentSymbol();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const { limitAsset = 0 } = values ?? {};
  const { aiInfo, symbolInfo } = useCreateInfo(symbolCode);
  const { quota } = symbolInfo;
  const lastTradedPrice = useLastTradedPrice(symbolCode);
  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 汇集所有参数
  const allParams = {
    templateId: 8,
    stra: 'SPOT_AI_GRID',
    symbol: symbolCode,
    ...aiInfo,
    inverst: limitAsset,
    symbolInfo,
    coupon,
    couponId: coupon?.id,
    createWay: 'AI',
    lastTradedPrice,
  };

  useSymbolChange(form, symbolCode);
  return (
    <FormWrapper className="Auto" form={form}>
      <SettingRows aiInfo={aiInfo} quota={quota} />
      <Divider />
      <Investment symbol={symbolCode} minInvest={aiInfo.minInvestment} hasMultiCoin={false} />
      <SubmitButton form={form} setInProp={allParams} clearCoupon={setCoupon} type="ai" />
    </FormWrapper>
  );
});

export default Auto;
