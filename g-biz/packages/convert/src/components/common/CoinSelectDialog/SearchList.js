/*
 * owner: borden@kupotech.com
 */
import { useTranslation } from '@tools/i18n';
import { styled, Empty, Virtualized, useResponsive } from '@kux/mui';
import React, { useMemo, useState, useEffect } from 'react';
import { findIndex } from 'lodash';
import useContextSelector from '../../../hooks/common/useContextSelector';
import SearchItem from './SearchItem';

const { AutoSizer, FixedSizeList } = Virtualized;

const SearchListRoot = styled.div`
  flex: 1;
  margin-top: 16px;
  margin-right: 4px;
`;

const Container = styled.div`
  height: 100%;
  position: relative;
  * {
    &::-webkit-scrollbar {
      background: transparent;
      width: 3px;
      height: 2px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: ${(props) => props.theme.colors.cover8};
    }
  }
`;
const StyledEmpty = styled(Empty)`
  width: 100%;
  position: absolute;
  top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/**
 * 排序规则，优先精确匹配，其次前缀匹配，最后包含匹配。
 * 包含匹配的情况，摘取除了匹配部分后剩下的前缀部分和后缀部分，先按前缀排序，前缀一样再按后缀排序。
 * 前两种其实可以视为第三种的特殊情况，所有算法可以统一按第三种处理。
 * 不区分大小写
 */
const filterCoin = ({ dataSource = [], searchText = '', currenciesMap }) => {
  // 基础边界情况处理
  if (!searchText) return [...(dataSource || [])];
  if (!dataSource || dataSource.length === 0) return [];

  searchText = searchText.trim();
  const lowerSearch = searchText.toLowerCase();
  const searchLength = searchText.length;

  // 匹配和数据结构转换
  const matchedItems = dataSource.reduce((results, item) => {
    item = { ...item, ...(currenciesMap?.[item.currency] || null) };
    const currency = item.currencyName || '';
    const lowerCurrency = currency.toLowerCase();
    const position = lowerCurrency.indexOf(lowerSearch);

    // 跳过不匹配项
    if (position === -1) return results;

    // 对匹配的字段进行替换，改成高亮文案
    item._matchSearch = [['currencyName'], searchText];
    // 提取前后文并保留原始数据
    results.push({
      originalItem: item, // 保留完整原对象
      lowerPrefix: currency.slice(0, position).toLowerCase(),
      lowerSuffix: currency.slice(position + searchLength).toLowerCase(),
    });

    return results;
  }, []);

  // 排序
  matchedItems.sort(
    (a, b) =>
      a.lowerPrefix.localeCompare(b.lowerPrefix) ||
      a.lowerSuffix.localeCompare(b.lowerSuffix) ||
      -1,
  );

  // 返回原始对象
  return matchedItems.map((item) => item.originalItem);
};

const SearchList = (props) => {
  const { sm } = useResponsive();
  const { value, dataSource, searchText } = props;
  const currenciesMap = useContextSelector((state) => state.currenciesMap);

  const { t: _t } = useTranslation('convert');
  const [listRef, setListRef] = useState(null);
  const [direction, setDirection] = useState('ltr');

  const list = useMemo(() => {
    if (!searchText) {
      return dataSource;
    }
    return filterCoin({
      searchText,
      dataSource,
      currenciesMap,
    });
  }, [dataSource, searchText, currenciesMap]);

  useEffect(() => {
    const _direction = document.querySelector('html').dir || 'ltr';
    setDirection(_direction);
  }, []);

  useEffect(() => {
    if (listRef) {
      // 搜索中，滚动到顶
      if (searchText) {
        setTimeout(() => {
          listRef.scrollTo(0);
        }, 0);
        return;
      }
      // 否则滚动到当前选择的币种
      const idx = findIndex(list, (v) => v.currency === value);
      if (idx >= 0) {
        setTimeout(() => {
          listRef.scrollToItem(idx, 'center');
        }, 0);
      }
    }
  }, [value, list, listRef, searchText]);

  const listLength = list?.length;
  return (
    <SearchListRoot>
      <Container>
        {listLength ? (
          <AutoSizer>
            {({ width, height }) => {
              return (
                <FixedSizeList
                  width={width}
                  height={height}
                  direction={direction}
                  itemCount={listLength}
                  itemSize={sm ? 64 : 52}
                  ref={(ref) => setListRef(ref)}
                >
                  {({ index, style }) => {
                    const data = list[index];
                    return <SearchItem data={data} value={value} style={style} />;
                  }}
                </FixedSizeList>
              );
            }}
          </AutoSizer>
        ) : (
          <StyledEmpty size="small" description={_t('678WABnThqkABxZsmacgsA')} />
        )}
      </Container>
    </SearchListRoot>
  );
};

export default React.memo(SearchList);
