/**
 * Owner: harry.lai@kupotech.com
 */
import React, { memo } from 'react';
import { map, includes } from 'lodash';
import Tooltip from '@mui/Tooltip';
import DropdownSelect from '@/components/DropdownSelect';
import { multiply, dropZero } from 'helper';
import { _t } from 'utils/lang';
import { valIsEmpty } from 'utils/tools';
import { commonSensorsFunc } from '@/meta/sensors';
import SymbolPrecision from '@/components/SymbolPrecision';
import CoinCodeToName from '@/components/CoinCodeToName';
import { NumFormat, TriggerPrice, DropdownExtend, MergeLabelText, MergeContent } from '../style';

// 统一处理数据tooltip（数据展示不下时，省略显示，点击tooltip可显示完整数值）
// 设计修改，tooltip全部去掉
export const numTooltip = ({ coin, content }) => {
  const _content = (
    <NumFormat>
      <span>{content}</span>
      <span className="coinName">
        <CoinCodeToName coin={coin} />
      </span>
    </NumFormat>
  );

  return _content;
};

export const NumToolTipWrap = memo(({ coin, children }) => {
  return (
    <NumFormat>
      <span>{children}</span>
      <span className="coinName">
        <CoinCodeToName coin={coin} />
      </span>
    </NumFormat>
  );
});

export const ocoLimitPrice = (records = {}) => {
  const { symbol, limitPrice, stopType, displayType } = records;
  if ((includes(stopType, 'oco') || includes(displayType, 'oco')) && limitPrice) {
    return (
      <span>
        <span style={{ margin: '0 4px' }}>|</span>
        <SymbolPrecision symbol={symbol} value={limitPrice} precisionKey="pricePrecision" />
      </span>
    );
  }
  return null;
};

export const genSelect = ({ value, key, onChange, options, sensorKey, sensorType }) => {
  const configs = map(options, (item, index) => ({
    label: () => {
      return item.text();
    },
    valueLabel: () => {
      return item.value ? item.text() : item.title(); // 值为空时显示内容定制
    },
    value: item.value,
    key: `${item.value}_${index}`,
  }));
  const handleChange = (v) => {
    if (sensorKey && sensorType) {
      commonSensorsFunc([sensorKey, sensorType, 'click']);
    }
    if (onChange) {
      onChange(key, v);
    }
  };
  return (
    <DropdownSelect
      placement="bottom-start"
      extendStyle={DropdownExtend}
      configs={configs}
      value={value}
      optionLabelProp="valueLabel"
      onChange={handleChange}
    />
  );
};

/**
 * 跟踪委托触发价格
 */
export const tsoTriggerPriceRender = (record, { tipContainer, showTip }) => {
  const { pop, stopPrice, status, activateCondition, side } = record;
  const isActive = status === 'ACTIVE';
  // 0 为 =, 买单显示小于等于，卖单显示大于等于, 1:  >=, 2: <=
  let symbol = activateCondition === 2 ? '≤' : '≥';
  // 为 0, 且为买单
  if (activateCondition === 0 && String(side).toLowerCase() === 'buy') {
    symbol = '≤';
  }
  const content = (
    <TriggerPrice>
      <span className={isActive ? 'activatePrice' : ''}>{`${symbol}${dropZero(stopPrice)}`}</span>
      <span className="divider">|</span>
      <span>{valIsEmpty(pop) ? '--' : `${multiply(pop, 100)}%`}</span>
    </TriggerPrice>
  );
  if (!showTip || !tipContainer) {
    return content;
  }
  const tipInfo = isActive ? _t('trd.form.tso.condition.trigger') : _t('trd.form.tso.condition');
  return (
    <Tooltip size="small" title={tipInfo} placement="top" trigger="click" container={tipContainer}>
      {content}
    </Tooltip>
  );
};

/** 合并columns */
export const mergeColumns = (column1, column2, options = {}) => {
  const { align = 'right' } = options;
  return {
    key: `${column1.key}_${column2.key}`,
    dataIndex: `${column1.key}_${column2.key}`,
    title: (
      <MergeLabelText align={align}>
        <div>{column1.title}/</div>
        <div>{column2.title}</div>
      </MergeLabelText>
    ),
    render(record1, record2, records) {
      return (
        <MergeContent align={align}>
          <div>{column1.render(record1, records)}</div>
          <div>{column2.render(record2, records)}</div>
        </MergeContent>
      );
    },
  };
};
