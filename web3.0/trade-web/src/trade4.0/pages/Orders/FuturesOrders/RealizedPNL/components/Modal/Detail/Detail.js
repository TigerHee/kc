/**
 * Owner: clyne@kupotech.com
 */
import React, { useMemo } from 'react';
import { _t } from 'utils/lang';
import { greaterThan, lessThan, toNonExponential } from 'utils/operation';

import { intlFormatDate } from '@/hooks/common/useIntlFormat';

import PrettyCurrency from '@/components/PrettyCurrency';
import PrettySize from '@/pages/Orders/FuturesOrders/components/PrettySize';
import { styled } from '@/style/emotion';

import { mockTax } from 'src/trade4.0/mockData';
import FormatPriceCell from '../../../../components/FormatPriceCell';
import Item, { ItemWrapper } from './Item';

export const item4 = () => `
  width: 25%;
  margin: 0;
  &:nth-of-type(4n + 4) {
    align-items: flex-end;
  }
`;

export const item3 = () => `
  width: 33.33%;
  margin-bottom: 8px;
  &:nth-of-type(3n + 3) {
    align-items: flex-end;
  }
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => props.theme.breakpoints.down('sm')} {
    &:not(:last-of-type) {
      margin-bottom: 16px !important;
    }
  }
  .item-box {
    ${(props) => (props.isShowTax ? item4() : item3())}
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 33.33%;
      ${(props) => (props.isShowTax ? 'margin-bottom: 12px;' : 'margin-bottom: 0')}
      &:nth-of-type(3n + 3) {
        align-items: flex-end;
      }
      &:nth-of-type(4n + 4) {
        align-items: flex-start;
      }
    }
  }
`;

const LabelWrapper = styled.div`
  margin: 6px 0 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text60};
`;

const Divider = styled.div`
  margin: 0 8px;
  width: 1px;
  height: 16px;
  background-color: ${(props) => props.theme.colors.divider8};
`;

const getTypeConfig = () => {
  return {
    profit: {
      label: {
        long: 'realised.detial.close.long',
        short: 'realised.detial.close.short',
      },
    },
    loss: {
      label: {
        long: 'realised.detial.close.long',
        short: 'realised.detial.close.short',
      },
    },
    keep: {
      label: {
        long: 'realised.detial.open.long',
        short: 'realised.detial.open.short',
      },
    },
  };
};

const Detail = ({ data, isLast, detailLastLabelKey, isShowTax }) => {
  const typeConfig = getTypeConfig();

  const type = useMemo(() => {
    if (greaterThan(data.realisedGrossCost)(0)) {
      return 'profit';
    }

    if (lessThan(data.realisedGrossCost)(0)) {
      return 'loss';
    }

    return 'keep';
  }, [data.realisedGrossCost]);

  // 获取平仓盈亏文案，需要自定义判断
  const labelKey = useMemo(() => {
    const isLong = data.side === 'BUY';
    const { label } = typeConfig[type];
    return isLast && detailLastLabelKey ? detailLastLabelKey : isLong ? label.long : label.short;
  }, [data.side, detailLastLabelKey, isLast, type, typeConfig]);

  return (
    <>
      <DetailBox className="detail-box" isShowTax={isShowTax}>
        <Item
          amount={
            <PrettyCurrency isShort value={data.realisedGrossCost} currency={data.currency} />
          }
          showColor
          value={data.realisedGrossCost}
        />
        <LabelWrapper>
          <span>{_t(labelKey)}</span>
          <Divider />
          <span>{intlFormatDate({ date: data.createdAt })}</span>
        </LabelWrapper>
        <ItemWrapper className="item-wrapper">
          <Item
            title={_t('assets.tradeHistory.filledAmount')}
            amount={<PrettySize value={data.size} symbol={data.symbol} />}
          />
          <Item
            title={_t('assets.tradeHistory.fillPrice')}
            amount={<FormatPriceCell value={toNonExponential(data.price)} symbol={data.symbol} />}
          />
          {isShowTax ? (
            <Item
              title={_t('futures.tax')}
              amount={
                <PrettyCurrency isShort value={data.tax || mockTax} currency={data.currency} />
              }
            />
          ) : null}
          <Item
            title={_t('assets.withdraw.fees')}
            amount={<PrettyCurrency isShort value={-data.dealComm} currency={data.currency} />}
          />
        </ItemWrapper>
      </DetailBox>
    </>
  );
};

export default React.memo(Detail);
