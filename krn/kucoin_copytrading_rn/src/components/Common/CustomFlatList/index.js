/*
 * @owner: borden@kupotech.com
 */
import React, {useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import BottomTip from 'components/FlatList/BottomTip';
import {FlatListVisualConfigPropsMap} from 'components/FlatList/constant';
import {ListEmptyContent} from 'components/FlatList/ListEmptyContent';
import {safeArray} from 'utils/helper';
import useRestaurantList from './useRestaurantList';

const CustomFlatList = props => {
  const {
    style,
    loading,
    data: propsData,
    HeaderComponent,
    StickyElementComponent,
    TopListElementComponent,
    ListHeaderComponentStyle,
    hiddenEmpty = false,
    ...otherProps
  } = props;
  const listRef = useRef(null);

  const [
    styles,
    scrollY,
    onLayoutHeaderElement,
    onLayoutTopListElement,
    onLayoutStickyElement,
  ] = useRestaurantList();

  const data = useMemo(() => safeArray(propsData), [propsData]);

  return (
    <SafeAreaView edges={['bottom']} style={style}>
      <Animated.View // <-- Sticky Component
        style={styles.stickyElement}
        onLayout={onLayoutStickyElement}>
        {StickyElementComponent}
      </Animated.View>

      <Animated.View // <-- Top of List Component
        style={styles.topElement}
        onLayout={onLayoutTopListElement}>
        {TopListElementComponent}
      </Animated.View>

      <Animated.FlatList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        data={data}
        {...FlatListVisualConfigPropsMap.largeCard}
        {...otherProps}
        ListHeaderComponent={
          // <-- Header Component
          <Animated.View onLayout={onLayoutHeaderElement}>
            {HeaderComponent}
          </Animated.View>
        }
        ListHeaderComponentStyle={[ListHeaderComponentStyle, styles.header]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
        ListEmptyComponent={
          !hiddenEmpty ? (
            <ListEmptyContent loading={loading} size={data?.length} />
          ) : null
        }
        ListFooterComponent={
          data.length !== 0 && !loading ? <BottomTip /> : null
        }
      />
    </SafeAreaView>
  );
};

export default React.memo(CustomFlatList);
