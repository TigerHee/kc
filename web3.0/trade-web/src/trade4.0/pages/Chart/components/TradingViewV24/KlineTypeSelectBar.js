/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { map, find, indexOf } from 'lodash';
import { ICFavoriteUnselectOutlined, ICFavoriteSelectOutlined } from '@kux/icons';
import DropdownSelect from '@/components/DropdownSelect';
import { useKlineTypeList, useOuterShown } from '@/pages/Chart/hooks/useChartToolBar';
import {
  IntervalWrapper,
  LabelWrapper,
  TextItem,
  DropdownExtend,
  IconSelectName,
  IconSelectIcon,
  IconSelectValue,
} from './style';

export default ({ klineType, onKlineTypeChange }) => {
  const { klineTypeList, displayList, addKlineTypeShow, dropKlineTypeShow } = useKlineTypeList();
  const enableOuter = useOuterShown();

  const valueData = useMemo(() => {
    if (!displayList?.length) {
      return {};
    }
    if (indexOf(displayList, klineType) > -1) {
      return {};
    }
    return find(klineTypeList, { value: klineType });
  }, [displayList, klineTypeList, klineType]);

  const addFavorites = useCallback(
    (e, value) => {
      e.stopPropagation();
      addKlineTypeShow(value);
    },
    [addKlineTypeShow],
  );

  const removeFavorites = useCallback(
    (e, value) => {
      e.stopPropagation();
      dropKlineTypeShow(value);
    },
    [dropKlineTypeShow],
  );

  const selectList = useMemo(() => {
    const renderLabel = (icon, text) => {
      return (
        <IconSelectName>
          <IconSelectIcon type={icon} size={16} fileName="chart" />
          {text}
        </IconSelectName>
      );
    };
    const list = map([...klineTypeList], (item) => {
      item.label = enableOuter ? (
        <LabelWrapper>
          {renderLabel(item.icon, item.text)}
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
        <LabelWrapper>{renderLabel(item.icon, item.text)}</LabelWrapper>
      );

      item.iconLabel = <IconSelectValue type={item.icon} size={16} fileName="chart" />;
      return item;
    });
    return list;
  }, [klineTypeList, enableOuter, addFavorites, removeFavorites]);

  const hasOutter = displayList.length;
  return (
    <IntervalWrapper
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {map(klineTypeList, ({ value, icon, enable }) => {
        if (enable) {
          return (
            <TextItem
              key={value}
              className={value === klineType ? 'active' : ''}
              onClick={() => onKlineTypeChange(value)}
            >
              <IconSelectValue type={icon} size={16} fileName="chart" />
            </TextItem>
          );
        }
      })}
      {valueData?.value ? (
        <TextItem className="value-data" onClick={() => onKlineTypeChange(valueData.value)}>
          <IconSelectValue type={valueData?.icon} size={16} fileName="chart" />
        </TextItem>
      ) : null}

      <DropdownSelect
        placement="bottom-end"
        extendStyle={DropdownExtend}
        isShowArrow={hasOutter}
        optionLabelProp={hasOutter ? 'noLabel' : 'iconLabel'}
        configs={selectList}
        value={klineType}
        onChange={onKlineTypeChange}
        trigger="hover"
      />
    </IntervalWrapper>
  );
};
