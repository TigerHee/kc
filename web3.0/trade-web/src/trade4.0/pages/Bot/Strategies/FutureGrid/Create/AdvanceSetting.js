/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import { isNull, isZero, floatToPercent } from 'Bot/helper';
import { FormNumberInputItem, Form } from 'Bot/components/Common/CForm';
import { _t } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';
import { useFuturePrice } from 'Bot/hooks/useLastTradedPrice';

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
const AdvanceSetting = React.memo(
  ({
    blowUpPrice,
    upperPrice,
    lowerPrice,
    direction,
    stopLossRatio, // 来自calc接口
    symbolInfo,
  }) => {
    const form = Form.useFormInstance();
    const { precision, quota, symbolCode, priceIncrement } = symbolInfo;
    let lastTradedPrice = useFuturePrice(symbolCode);
    lowerPrice = +lowerPrice;
    upperPrice = +upperPrice;
    blowUpPrice = +blowUpPrice;
    lastTradedPrice = +lastTradedPrice;

    stopLossRatio = stopLossRatio ? floatToPercent(stopLossRatio, 2) : null;

    // 区间价格变化需要手动校验止损价格
    // 区间上限, 下限,当前价格变化需要重新教研
    React.useEffect(() => {
      form.getFieldValue('stopLossPrice') !== undefined &&
        form.validateFields(['stopLossPrice'], { force: true });
    }, [lowerPrice, upperPrice, lastTradedPrice, blowUpPrice]);
    // 当前价格变化需要重新教研
    React.useEffect(() => {
      form.getFieldValue('stopProfitPrice') !== undefined &&
        form.validateFields(['stopProfitPrice'], { force: true });
    }, [lastTradedPrice]);

    // 止盈价的变化可以不及时发起请求， 提交就可以
    // 触发开单价 会影响entryContractNum参数的计算，需要及时提交
    // stopLossRatio也需要及时发起请求

    const infoContentKeys = React.useMemo(() => getInfoContentKeys(direction), [direction]);
    return (
      <AdvanceSettingWrap infoContentKeys={infoContentKeys}>
        <FormNumberInputItem
          className="mb-10"
          name="stopLossPrice"
          placeholder={_t('gridform21')}
          unit={quota}
          maxPrecision={precision}
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
                // 做多：预估强平价<止损价<math.min(区间下限,current)
                const minLower = Math.min(lowerPrice, lastTradedPrice);
                if (direction === 'long') {
                  if (value >= minLower) {
                    cb(
                      _t('futrgrid.stoppricenotoverlowerprice', {
                        price: minLower,
                      }),
                    );
                  }
                  if (blowUpPrice) {
                    if (blowUpPrice >= value) {
                      cb(_t('futrgrid.longstopprice'));
                    }
                  }
                }
                // 做空：min(区间上限,current)<止损价<预估强平价
                const minUpper = Math.min(upperPrice, lastTradedPrice);
                if (direction === 'short') {
                  if (value <= minUpper) {
                    cb(
                      _t('futrgrid.stoppricenotlessupperprice', {
                        price: minUpper,
                      }),
                    );
                  }
                  if (blowUpPrice) {
                    if (blowUpPrice <= value) {
                      cb(_t('futrgrid.shortstopprice'));
                    }
                  }
                }
                cb();
              },
            },
          ]}
        />
        {!!stopLossRatio && (
          <Text as="div" color="text40" fs={12} mb={10} mt={-2}>
            {_t('futrgrid.triggerstoppricehint', {
              estimatedStopLossPrice: stopLossRatio,
            })}
          </Text>
        )}
        <FormNumberInputItem
          className="mb-10"
          name="stopProfitPrice"
          unit={quota}
          placeholder={_t('stopprofit')}
          maxPrecision={precision}
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
                // 做多止盈价必须高于开单价(当前价)
                if (direction === 'long') {
                  if (value <= lastTradedPrice) {
                    cb(
                      _t('futrgrid.profitpricenotoverlowerprice', {
                        price: lastTradedPrice,
                      }),
                    );
                  }
                }
                // 做空止盈价必须低于开单价(当前价)
                if (direction === 'short') {
                  if (value >= lastTradedPrice) {
                    cb(
                      _t('futrgrid.profipricenotlessupperprice', {
                        price: lastTradedPrice,
                      }),
                    );
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
          maxPrecision={precision}
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
                // 做多 触发价需低于当前价
                if (direction === 'long') {
                  if (value >= lastTradedPrice) {
                    cb(_t('futrgrid.longopenpriceshould'));
                  }
                }
                // 做空 触发价需高于当前价
                if (direction === 'short') {
                  if (value <= lastTradedPrice) {
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
  },
);

export default AdvanceSetting;
