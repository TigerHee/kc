import {useMemoizedFn} from 'ahooks';
import React, {memo, useCallback, useEffect, useState} from 'react';
import Carousel from 'react-native-snap-carousel';
import {KRNEventEmitter} from '@krn/bridge';

import useTracker from 'hooks/useTracker';
import {CommonCmsConfigBanner} from './CommonCmsConfigBanner';
import Pagination from './Pagination';
import {ActivityCard, CarouselWidth} from './styles';
import {usePullBannerQuery} from './usePullBannerQuery';

const renderCarouselItem = ({item, index}) => {
  const {config} = item;

  return <CommonCmsConfigBanner index={index} config={config} />;
};

const ActivityBar = ({isLeadTrader}) => {
  const {bannerList} = usePullBannerQuery();
  const [activeItem, setActiveItem] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const {onExpose} = useTracker();

  // Carousel firstItem变换后仍需重新 render
  const refreshCarousel = useCallback(() => {
    setShowCarousel(false);
    setTimeout(() => {
      setShowCarousel(true);
    }, 0);
  }, [setShowCarousel]);

  // 需求：重新进入跟单 轮播回到第一项
  useEffect(() => {
    const subscriptionOnShow = KRNEventEmitter.addListener('onShow', () => {
      setActiveItem(0);
      refreshCarousel();
    });

    return () => {
      subscriptionOnShow && subscriptionOnShow.remove();
    };
  }, [refreshCarousel]);

  useEffect(() => {
    // Carousel 数据变更 需要rerender carousel 组件 页码才会正常
    if (bannerList?.length) {
      refreshCarousel();
    }
  }, [bannerList]);

  const onSnapToItem = useMemoizedFn(idx => {
    onExpose({
      blockId: 'banner',
      locationId: 'cms',
      properties: {
        index: idx,
      },
    });
    setActiveItem(idx);
  });

  if (!bannerList?.length) {
    return null;
  }

  return (
    <ActivityCard isLeadTrader={isLeadTrader}>
      {showCarousel && (
        <Carousel
          shouldOptimizeUpdates
          scrollEnabled={bannerList?.length > 1}
          bounces={true}
          enableMomentum={false}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          firstItem={activeItem}
          pagingEnabled={false}
          sliderWidth={CarouselWidth}
          itemWidth={CarouselWidth}
          data={bannerList}
          onSnapToItem={onSnapToItem}
          renderItem={renderCarouselItem}
        />
      )}
      {bannerList?.length > 1 && (
        <Pagination bannerList={bannerList} activeItem={activeItem} />
      )}
    </ActivityCard>
  );
};

export default memo(ActivityBar);
