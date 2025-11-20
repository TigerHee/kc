import React, {forwardRef, memo, useMemo} from 'react';
import {FlatList as RNFlatList} from 'react-native';
import {css} from '@emotion/native';

import useLang from 'hooks/useLang';
import {isAndroid, safeArray} from 'utils/helper';
import BottomTip from './BottomTip';
import {FlatListVisualConfigPropsMap} from './constant';
import {ListEmptyContent} from './ListEmptyContent';

const ListFooter = memo(({size, loading}) => {
  const {_t} = useLang();

  const text = loading
    ? _t('923af36fddbe4000ad93')
    : _t('6121fac83c5a4000a9ce');

  if (size === 0) {
    return null;
  }
  return <BottomTip text={text} />;
});

const FlatList = forwardRef((props, ref) => {
  const {
    loading,
    data: propsData,
    renderItem,
    onEndReachedThreshold = 0.2,
    keyExtractor,
    hiddenEmpty = false,
    initialNumToRender = 5,
    isFetching,
    ...others
  } = props;

  const data = useMemo(() => safeArray(propsData), [propsData]);

  const enhanceKeyExtractor = (item, idx) =>
    keyExtractor ? keyExtractor(item, idx) : idx;

  return (
    <RNFlatList
      style={css`
        flex: 1;
      `}
      ref={ref}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={onEndReachedThreshold}
      ListEmptyComponent={
        !hiddenEmpty ? (
          <ListEmptyContent loading={loading} size={data?.length} />
        ) : null
      }
      ListFooterComponent={
        <ListFooter size={data?.length || 0} loading={isFetching || loading} />
      }
      data={data}
      renderItem={renderItem}
      keyExtractor={enhanceKeyExtractor}
      initialNumToRender={initialNumToRender}
      removeClippedSubviews={isAndroid}
      {...FlatListVisualConfigPropsMap.largeCard}
      {...others}
    />
  );
});

export default memo(FlatList);
