/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import { isNull, isZero } from 'Bot/helper';
import { FormNumberInputItem, Form } from 'Bot/components/Common/CForm';
import { _t } from 'Bot/utils/lang';
import Decimal from 'decimal.js';

// 高级参数 提示 title content 配置
const getInfoContentKeys = (direction) => {
  const contents = [
    ['gridform21', 'futrgrid.stoppricehintlong'],
    ['stopprofit', 'stopprofitpricehintlong'],
    ['openprice', 'futrgrid.openpricelong'],
  ];
  if (direction) {
    contents[0][1] = `futrgrid.stoppricehint${direction}`;
    contents[1][1] = `stopprofitpricehint${direction}`;
    contents[2][1] = `futrgrid.openprice${direction}`;
  }
  return contents;
};
const AdvanceSetting = React.memo(({ direction, symbolInfo, lastTradedPrice }) => {
  const form = Form.useFormInstance();
  const { pricePrecision, quota, priceIncrement } = symbolInfo;
  lastTradedPrice = +lastTradedPrice;
  // 当前价格, 方向变化 强制重新校验
  React.useEffect(() => {
    ['stopLossPrice', 'stopProfitPrice', 'openUnitPrice'].forEach((fieldKey) => {
      form.getFieldValue(fieldKey) !== undefined &&
        form.validateFields([fieldKey], { force: true });
    });
  }, [lastTradedPrice, direction]);

  const infoContentKeys = React.useMemo(() => getInfoContentKeys(direction), [direction]);
  return (
    <AdvanceSettingWrap infoContentKeys={infoContentKeys}>
      <FormNumberInputItem
        className="mb-10"
        name="stopLossPrice"
        placeholder={_t('gridform21')}
        unit={quota}
        maxPrecision={pricePrecision}
        step={priceIncrement}
        rules={[
          {
            required: false,
            validator: (rule, value, cb) => {
              if (isNull(value)) {
                return cb();
              }
              if (isZero(value)) {
                return cb(_t('gridform8'));
              }
              value = Number(value);
              // 做多：止损价需小于当前价格的85%，大于0
              if (direction === 'long' && lastTradedPrice) {
                const val = Number(Decimal(lastTradedPrice).mul(0.85).toString());
                if (value >= val) {
                  cb(_t('futrgrid.stoppricenotoverlowerprice', { price: val }));
                }
              }
              // 做空：止损价需大于当前市场价格，大于0
              if (direction === 'short' && lastTradedPrice) {
                if (value <= lastTradedPrice) {
                  cb(_t('futrgrid.stoppricenotlessupperprice', { price: lastTradedPrice }));
                }
              }
              cb();
            },
          },
        ]}
      />
      <FormNumberInputItem
        className="mb-10"
        name="stopProfitPrice"
        unit={quota}
        placeholder={_t('stopprofit')}
        maxPrecision={pricePrecision}
        step={priceIncrement}
        rules={[
          {
            required: false,
            validator: (rule, value, cb) => {
              if (isNull(value)) {
                return cb();
              }
              if (isZero(value)) {
                return cb(_t('gridform8'));
              }
              value = Number(value);
              // 做多止盈价必须高于(当前价)
              if (direction === 'long') {
                if (lastTradedPrice && value <= lastTradedPrice) {
                  // 止盈价须大于{price} 做多：止盈价需大于当前市场价格，大于0
                  cb(_t('futrgrid.profitpricenotoverlowerprice', { price: lastTradedPrice }));
                }
              }
              // 止盈价需小于当前市场价格，大于0
              if (direction === 'short') {
                if (lastTradedPrice && value >= lastTradedPrice) {
                  cb(_t('futrgrid.profipricenotlessupperprice', { price: lastTradedPrice }));
                }
              }
              cb();
            },
          },
        ]}
      />
      <FormNumberInputItem
        name="openUnitPrice"
        placeholder={_t('openprice')}
        maxPrecision={pricePrecision}
        step={priceIncrement}
        unit={quota}
        rules={[
          {
            required: false,
            validator: (rule, value, cb) => {
              if (isNull(value)) {
                return cb();
              }
              if (isZero(value)) {
                return cb(_t('gridform8'));
              }
              value = Number(value);
              // 触发开单价需小于当前市场价格，大于0
              if (direction === 'long') {
                if (lastTradedPrice && value >= lastTradedPrice) {
                  // 触发开单价需低于当前价
                  cb(_t('futrgrid.longopenpriceshould'));
                }
              }
              // 触发开单价需大于当前市场价格，大于0
              if (direction === 'short') {
                if (lastTradedPrice && value <= lastTradedPrice) {
                  // 触发开单价需高于当前价
                  cb(_t('futrgrid.shortopenpriceshould'));
                }
              }
              cb();
            },
          },
        ]}
      />
    </AdvanceSettingWrap>
  );
});

export default AdvanceSetting;
