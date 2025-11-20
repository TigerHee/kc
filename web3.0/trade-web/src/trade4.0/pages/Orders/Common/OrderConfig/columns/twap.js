/**
 * Owner: harry.lai@kupotech.com
 */
import React from 'react';
import Tooltip from '@mui/Tooltip';
import { ICQuestionOutlined } from '@kux/icons';
import SymbolPrecision from '@/components/SymbolPrecision';
import NumberFormatWithLang from '@/components/NumberFormatWithLang';
import { _t } from 'utils/lang';
import { dividedBy } from 'utils/operation';

import { genSelect, NumToolTipWrap } from '../nodeHelper';
import {
  DISTANCE_TYPE_MAP,
  TWAP_ALL_STATUS_SELECT_OPTIONS,
  TWAP_PROCESS_STATUS,
  TWAP_PROCESS_STATUS_TEXT_MAP,
} from '../constants';
import {
  CancelOperatorTitle,
  TWAPOperatorButton,
  DivideLine,
  TWAPOperatorWrap,
  TWAPConditionWrap,
  NoWrapSpan,
} from '../../style';

export const createTwapConditionColumn = () => ({
  key: 'condition',
  dataIndex: 'condition',
  width: '20%',
  title: _t('sX1rfDBFez5jhKAvJiWicf'),
  render(_, records) {
    const { symbol, priceLimit, distanceType, distanceValue } = records;
    const distanceValueIsPrice = distanceType === DISTANCE_TYPE_MAP.FIXED;
    const [, unit] = symbol.split('-');
    return (
      <TWAPConditionWrap>
        <NoWrapSpan>
          <NumToolTipWrap coin={unit}>
            <SymbolPrecision symbol={symbol} value={priceLimit} precisionKey="basePrecision" />
          </NumToolTipWrap>
        </NoWrapSpan>

        <DivideLine />
        {distanceValueIsPrice ? (
          <NoWrapSpan>
            <NumToolTipWrap coin={unit}>
              <SymbolPrecision symbol={symbol} value={distanceValue} precisionKey="basePrecision" />
            </NumToolTipWrap>
          </NoWrapSpan>
        ) : (
          distanceValue && (
            <NumberFormatWithLang
              options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            >
              {distanceValue}
            </NumberFormatWithLang>
          )
        )}
      </TWAPConditionWrap>
    );
  },
});

export const createTwapAvgPriceColumn = () => ({
  key: 'avgPrice',
  dataIndex: 'avgPrice',
  title: _t('orders.c.avg'),
  render(_, records) {
    const { symbol, filledFunds, filledSize } = records;
    if ([filledFunds, filledSize].includes(undefined)) {
      return '-';
    }
    // (filledAmount": 成交总金额 /  "filledSize": 成交总数量)
    const avgPrice = dividedBy(filledFunds)(filledSize);
    const [, unit] = symbol?.split?.('-');
    return (
      <NumToolTipWrap coin={unit}>
        <SymbolPrecision symbol={symbol} value={avgPrice} precisionKey="pricePrecision" />
      </NumToolTipWrap>
    );
  },
});

export const createTwapAllColumn = (value, onChange) => ({
  key: 'status',
  dataIndex: 'status',
  isSelect: true,
  title: genSelect({ value, key: 'status', onChange, options: TWAP_ALL_STATUS_SELECT_OPTIONS }),
  render(record) {
    const sideTemp = TWAP_ALL_STATUS_SELECT_OPTIONS.find(
      (dir) => dir.value.toUpperCase() === (record || '').toUpperCase(),
    );
    return <span side={(record || '').toUpperCase()}>{sideTemp && sideTemp.text()}</span>;
  },
});

export const createTwapCancelOperatorColumn = ({
  onCancelAll,
  onCancel,
  runOrPauseOrder,
  config = {},
}) => {
  const { isDisableCancel, disabledAllCancel = false } = config || {};
  return {
    key: 'operator',
    dataIndex: 'operator',
    title: (
      <CancelOperatorTitle>
        <a onClick={disabledAllCancel ? undefined : onCancelAll} disabled={disabledAllCancel}>
          {_t('orders.c.cancel.multi')}
        </a>
        <Tooltip size="small" placement="top" title={_t('9JKe8WzurtuqacyVdAKcQK')}>
          <ICQuestionOutlined size={12} />
        </Tooltip>
      </CancelOperatorTitle>
    ),
    render(_, records) {
      const disabled =
        typeof isDisableCancel === 'function' ? isDisableCancel(records && records.symbol) : false;

      return (
        <TWAPOperatorWrap>
          <TWAPOperatorButton onClick={() => runOrPauseOrder(records)}>
            {records.status === TWAP_PROCESS_STATUS.PAUSED && _t('oZoxrpAVjA9CDTX72NXYwq')}
            {records.status === TWAP_PROCESS_STATUS.PENDING && _t('b7jwBYW5nUMUkxiuGSKhD6')}
          </TWAPOperatorButton>
          <DivideLine marginHorizontal={12} />
          <TWAPOperatorButton
            onClick={
              disabled
                ? undefined
                : () => {
                    onCancel(records);
                  }
            }
            disabled={disabled}
          >
            {_t('orders.c.cancel')}
          </TWAPOperatorButton>
        </TWAPOperatorWrap>
      );
    },
  };
};

export const createTwapHistoryStatusColumn = ({ value, onChange, sensorKey, sensorType }) => ({
  key: 'status',
  isSelect: true,
  title: genSelect({
    value,
    key: 'status',
    onChange,
    options: TWAP_ALL_STATUS_SELECT_OPTIONS,
    sensorKey,
    sensorType,
  }),
  render(_, records) {
    const { status } = records;
    const statusText = TWAP_PROCESS_STATUS_TEXT_MAP[status] || '-';
    return (
      <Tooltip size="small" title={statusText} placement="top">
        <span>{statusText}</span>
      </Tooltip>
    );
  },
});
