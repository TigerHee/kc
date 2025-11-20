/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { map, find, indexOf } from 'lodash';
import { ICFavoriteUnselectOutlined, ICFavoriteSelectOutlined } from '@kux/icons';
import DropdownSelect from '@/components/DropdownSelect';
import { useIntervalList, useOuterShown } from '@/pages/Chart/hooks/useChartToolBar';
import { IntervalWrapper, LabelWrapper, TextItem, DropdownExtend } from './style';

export default ({ interval, onIntervalChange }) => {
  const { intervalList, displayList, addIntervalShow, dropIntervalShow } = useIntervalList();
  const enableOuter = useOuterShown();

  const valueData = useMemo(() => {
    if (!displayList?.length) {
      return {};
    }

    if (indexOf(displayList, interval) > -1) {
      return {};
    }
    return find(intervalList, { value: interval });
  }, [displayList, intervalList, interval]);

  const addFavorites = useCallback(
    (e, value) => {
      e.stopPropagation();
      addIntervalShow(value);
    },
    [addIntervalShow],
  );

  const removeFavorites = useCallback(
    (e, value) => {
      e.stopPropagation();
      dropIntervalShow(value);
    },
    [dropIntervalShow],
  );

  const selectList = useMemo(() => {
    const list = map([...intervalList], (item) => {
      item.label = enableOuter ? (
        <LabelWrapper>
          {item.valueLabel}
          {item.enable ? (
            <ICFavoriteSelectOutlined
              onClick={(e) => removeFavorites(e, item.value)}
              className="active-icon"
            />
          ) : (
            <ICFavoriteUnselectOutlined onClick={(e) => addFavorites(e, item.value)} />
          )}
        </LabelWrapper>
      ) : (
        item.valueLabel
      );
      return item;
    });
    return list;
  }, [intervalList, enableOuter, addFavorites, removeFavorites]);

  const hasOutter = displayList.length;

  return (
    <IntervalWrapper
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {map(intervalList, ({ value, valueLabel, enable }) => {
        if (enable) {
          return (
            <TextItem
              key={value}
              className={value === interval ? 'active' : ''}
              onClick={() => onIntervalChange(value)}
            >
              {valueLabel}
            </TextItem>
          );
        }
      })}
      {valueData?.value ? (
        <TextItem className="value-data" onClick={() => onIntervalChange(valueData.value)}>
          {valueData.valueLabel}
        </TextItem>
      ) : null}

      <DropdownSelect
        placement="bottom-end"
        extendStyle={DropdownExtend}
        isShowArrow={!0}
        optionLabelProp={hasOutter ? 'noLabel' : 'valueLabel'}
        configs={selectList}
        value={interval}
        onChange={onIntervalChange}
        trigger="hover"
      />
    </IntervalWrapper>
  );
};
