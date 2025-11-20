/**
 * Owner: clyne@kupotech.com
 */

import { styled } from '@/style/emotion';
import { ICDeleteOutlined, ICEdit2Outlined } from '@kux/icons';
import React, { memo, useEffect, useRef } from 'react';
import useI18n from '@/hooks/futures/useI18n';
import { toPercent } from 'helper';
import { map } from 'lodash';
import { greaterThanOrEqualTo } from 'src/utils/operation';
// import { trackExposeS } from 'utils/sensors';
// import { PNL_NOTICE_EXPOSE } from 'sensorsKey/pnlAlert';

import { useListOperation, usePnlList } from './hooks/usePnlList';
import { usePnlAlert } from './hooks/usePnlAlert';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

const ListWrapper = styled.div`
  .pnl-warn-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    margin-bottom: 16px;
    background-color: ${(props) => props.theme.colors.cover2};
    border-radius: 8px;
    .item-left {
      color: ${(props) => props.theme.colors.text};
      display: flex;
      align-items: center;
    }
    .percent-item {
      margin-left: 4px;
    }
    .primary-text {
      color: ${(props) => props.theme.colors.primary};
    }
    .secondary-text {
      color: ${(props) => props.theme.colors.secondary};
    }
    .item-operation {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: ${(props) => props.theme.colors.icon};
      .item-icon {
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      .item-icon + .item-icon {
        margin-left: 12px;
      }
    }
  }
`;

const Item = memo(({ data }) => {
  const { unrealisedRoePcnt } = data;
  const { _t } = useI18n();
  const { onDelete, onEdit } = useListOperation(data);
  const percent = toPercent(unrealisedRoePcnt);
  const { checked } = usePnlAlert();
  // className
  const percentCls = greaterThanOrEqualTo(unrealisedRoePcnt)(0) ? 'primary-text' : 'secondary-text';
  return (
    <div className="pnl-warn-item">
      <div className="item-left">
        <div>{_t('setting.pnl.roe')}</div>
        <div className={`${percentCls} percent-item`}>{percent}</div>
      </div>
      {checked ? (
        <div className="item-operation">
          <div className="item-icon">
            <ICEdit2Outlined onClick={onEdit} />
          </div>
          <div className="item-icon">
            <ICDeleteOutlined onClick={onDelete} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
});

const ExposeAlert = memo(({ list }) => {
  const currentSymbol = useGetCurrentSymbol();
  const { checked } = usePnlAlert();
  const symbolRef = useRef(null);
  const checkedRef = useRef(null);

  symbolRef.current = currentSymbol;
  checkedRef.current = checked;

  // 有值再上报
  useEffect(() => {
    if (list && list.length) {
      const value = map(list, (item) => item.unrealisedRoePcnt);

      futuresSensors.pnlAlert.listExpose({
        symbol: symbolRef.current,
        status: checkedRef.current ? 'open' : 'close',
        num: list.length,
        value,
      });
    }
    // 不需要监听其它的值，只在数据变动的时候，上报
  }, [list]);

  return null;
});

const AlertList = () => {
  const { list } = usePnlList();

  return (
    <>
      <ListWrapper>
        {map(list, (itemData, index) => (
          <Item data={itemData} key={`${itemData.id}-${index}`} />
        ))}
      </ListWrapper>
      <ExposeAlert list={list} />
    </>
  );
};

export default AlertList;
