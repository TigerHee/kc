/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// GooglePlay 不合规下架地区: 印尼
// const ILLEGAL_GP_LIST = ['ID'];

// export const COUNTRY_INFO_KEY = 'locale_country_info';
export const COUNTRY_INFO_PULLING_VALUE = undefined;

export const usePullCountryInfo = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'app/pullCountryInfo',
    });
    dispatch({
      type: 'app/pullAppGpDownloadConfig',
    });
  }, [dispatch]);
};

export const useGetCountryInfo = () => {
  const { countryInfo } = useSelector((state) => state.app);

  return countryInfo;
};

export const useIsPulling = () => {
  const { countryInfo } = useSelector((state) => state.app);

  return countryInfo === COUNTRY_INFO_PULLING_VALUE;
};

export const isLegalGp = (countryInfo, illegalGpList) => {
  const { countryCode } = countryInfo || {};

  // countryCode异常，兜底视作合规(无法获取IP归属地，展示方案A)
  if (!countryCode) {
    return true;
  }

  if (!illegalGpList?.length) {
    return true;
  }

  return !illegalGpList.includes(countryCode);
};

// GP是否合规
export const useIsLegalGp = () => {
  const { countryInfo, illegalGpList } = useSelector((state) => state.app);

  return isLegalGp(countryInfo, illegalGpList);
};

// 场景触发下载时的链接统一维护
export const getSceneDownloadLinks = (countryInfo, illegalGpList) => {
  const legalGp = isLegalGp(countryInfo, illegalGpList);

  if (legalGp) {
    return {
      // 引导打开APP半弹窗按钮：
      Guide: 'https://kucoin.onelink.me/iqEP/gmz14d5p',
      // 500U引导下载弹按钮：
      Modal: 'https://kucoin.onelink.me/iqEP/44gsnxav',
      // 新版本APP评分下载按钮：
      Banner: 'https://kucoin.onelink.me/iqEP/xy0tdqd1',
    };
  }

  return {
    Guide: 'https://kucoin.onelink.me/iqEP/b13j8t0l',
    Modal: 'https://kucoin.onelink.me/iqEP/mq0b70uh',
    Banner: 'https://kucoin.onelink.me/iqEP/9ib4f15p',
  };
};
