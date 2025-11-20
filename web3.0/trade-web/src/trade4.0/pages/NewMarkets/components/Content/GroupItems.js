/*
 * @Owner: Clyne@kupotech.com
 */
import React, { useCallback } from 'react';
import { BUSINESS_ENUM, ITEM_GROUPS_NUM, LIST_TYPE } from '../../config';
import SvgComponent from 'src/trade4.0/components/SvgComponent';
import { _t } from 'src/utils/lang';
import Item from './Item';
import { map } from 'lodash';
import { useTab } from '../MarketTabs/hooks/useTabs';
import { lessThanOrEqualTo } from 'src/utils/operation';

/**
 * header
 */
const GroupHeader = ({ header }) => {
  const { type, count = 0 } = header;
  // const { onChange } = useTab(1, false);
  const labelMap = {
    [BUSINESS_ENUM.SPOT]: 'tradeType.trade',
    [BUSINESS_ENUM.MARGIN]: 'tradeType.margin',
    [BUSINESS_ENUM.FUTURES]: 'tradeType.kumex',
  };
  const label = _t(labelMap[type]);

  return (
    <div className="group-header">
      <div className="group-left">
        <span>{label}</span>
        <span>{`(${count})`}</span>
      </div>
    </div>
  );
};

/**
 * footer
 */

const GroupFooter = ({ header }) => {
  const { type, count = 0 } = header;
  const { onChange } = useTab(1, false);
  const onClick = useCallback(
    (e) => {
      onChange(e, type, LIST_TYPE.SEARCH);
    },
    [onChange, type],
  );
  const text = `${_t('view.more')}(${count})`;
  if (lessThanOrEqualTo(count)('5')) {
    return <></>;
  }
  return (
    <div className="group-footer">
      <div onClick={onClick}>{text}</div>
      <SvgComponent onClick={onClick} size={12} fileName="markets" type="arrow" />
    </div>
  );
};

const Items = ({ items, tradeType }) => {
  return (
    <div className="groups-items">
      {map(items, (item) => (
        <Item tradeType={tradeType} {...item} />
      ))}
    </div>
  );
};

/**
 * Group
 */
const GroupItems = ({ items, header, tradeType }) => {
  if (items.length === 0) {
    return <></>;
  }
  return (
    <div className="market-group">
      <GroupHeader header={header} />
      <Items tradeType={tradeType} items={items.slice(0, ITEM_GROUPS_NUM)} />
      <GroupFooter header={header} />
    </div>
  );
};

export default GroupItems;
