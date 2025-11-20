import {useEffect, useMemo, useState} from 'react';
import {Image} from 'react-native';
import {useTheme} from '@krn/ui';

import {PersistTimeMap} from 'config/queryClient';
import {useQuery} from 'hooks/react-query';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {pullHomeBanner} from 'services/cms';
import {HOME_ACTIVITY_BANNER_TYPE} from './constant';

const COPY_TRADE_BANNER_KEY = 'h5-copytrading-banner';

// const DEFAULT_LIST = [FIRST_ITEM_APPLY_TRADER_BANNER];

export const usePullBannerQuery = () => {
  const {lang} = useLang();
  const {isRTL} = useTheme();

  const {data: resp, isLoading} = useQuery({
    queryKey: ['usePullBannerQuery', {lang}],
    queryFn: pullHomeBanner,
    staleTime: 10 * 1000 * 60, // 数据保持新鲜10分钟
    cacheTime: PersistTimeMap.halfDay,
  });

  const isLight = useIsLight();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const preloadImg = async () => {
      try {
        const imgList = resp?.data?.[COPY_TRADE_BANNER_KEY]?.map(i => {
          const {imageUrl, daytime_image_url: lightImageUrl} = i || {};
          return isLight ? lightImageUrl : imageUrl;
        })?.filter(i => !!i);

        if (!imgList?.length) return;
        const prefetchImages = imgList
          .filter(i => i?.indexOf?.('//') > -1)
          .map(image => Image.prefetch(image));

        await Promise.all(prefetchImages);
        setLoaded(true);
      } catch (error) {
        setLoaded(true);
        console.error('usePullBannerQuery-Image prefetch failed', error);
      }
    };
    preloadImg();
  }, [isLight, resp?.data]);

  const bannerList = useMemo(() => {
    if (!resp?.data) {
      return [];
    }
    const cmsBannerList =
      resp?.data?.[COPY_TRADE_BANNER_KEY]?.filter(i => {
        const {imageUrl, daytime_image_url: lightImageUrl} = i || {};
        return !!(isLight ? lightImageUrl : imageUrl);
      })?.map(i => ({
        config: i,
        type: HOME_ACTIVITY_BANNER_TYPE.others,
      })) || [];

    const list = cmsBannerList?.length === 0 || !loaded ? [] : cmsBannerList;

    if (isRTL) {
      return list?.slice().reverse();
    }
    return list;
  }, [resp?.data, loaded, isRTL, isLight]);

  return {
    bannerList,
    isLoading,
  };
};
