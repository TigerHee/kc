import React, {memo, useMemo, useRef} from 'react';
import {css} from '@emotion/native';

import DynamicEcharts from 'components/Common/DynamicEcharts';
import {BetweenWrap, RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {convertPxToReal} from 'utils/computedPx';
import {multiply} from 'utils/operation';
import {
  LegendBox,
  LegendCoinText,
  LegendRate,
  LegendScroll,
  LegendSymbol,
} from './styles';
import {colorList, useMakeOption} from './useMakeOption';

const getOtherLabel = ({_t, currency}) => {
  if (currency.toLowerCase() === 'other') {
    return _t('9d350549e1244000ac72');
  }
  return currency;
};
const PreferencePie = ({currencyPreferenceData}) => {
  const chartRef = useRef(null);
  const {_t} = useLang();
  const legendList = useMemo(() => {
    const sortData = [...currencyPreferenceData].sort((a, b) => {
      // 如果两个都不是Other，或者都是Other，按百分比降序排序
      if (a.currency !== 'Other' && b.currency !== 'Other') {
        return b.percent - a.percent;
      } else if (a.currency === 'Other') {
        // 如果a是Other，它应该在最后，所以返回1
        return 1;
      } else {
        // 如果b是Other，它应该在最后，所以返回-1
        return -1;
      }
    });

    return sortData?.map((i, idx) => {
      return {
        color: colorList[idx],
        rate: multiply(i.percent)(100).toFixed(2) + '%',
        coin: getOtherLabel({currency: i.currency, _t}),
        ...i,
      };
    });
  }, [_t, currencyPreferenceData]);

  const option = useMakeOption({list: legendList});

  return (
    <BetweenWrap
      style={css`
        margin-left: 12px;
      `}>
      <DynamicEcharts
        width={convertPxToReal(150)}
        height={convertPxToReal(180)}
        option={option}
        ref={chartRef}
      />
      <LegendScroll>
        <LegendBox>
          {legendList.map((i, idx) => {
            return (
              <BetweenWrap key={i.coin || idx} style={{marginBottom: 4}}>
                <RowWrap
                  style={css`
                    flex: 1;
                  `}>
                  <LegendSymbol color={i.color} />
                  <LegendCoinText>{i.coin}</LegendCoinText>
                </RowWrap>
                <LegendRate>{i.rate}</LegendRate>
              </BetweenWrap>
            );
          })}
        </LegendBox>
      </LegendScroll>
    </BetweenWrap>
  );
};
export default memo(PreferencePie);
