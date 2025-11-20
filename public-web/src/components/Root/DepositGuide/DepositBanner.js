/**
 * Owner: willen@kupotech.com
 */
import { useMediaQuery } from '@kufox/mui';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import { trackClick } from 'src/utils/ga';
import storage from 'src/utils/storage';
import Banner from './components/Banner';
import Drawer from './components/Drawer';
import { noneDepositBannerPage } from './config';

export default ({ pathname }) => {
  const dispatch = useDispatch();
  // new 2023-06-20 ：一律展示
  const [showBanner, setShowBanner] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const { recharged } = useSelector((state) => state.user);

  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const depositBannerShow = useSelector((state) => state.app.depositBannerShow);

  // const closeTime = storage.getItem('deposit_banner_close_time'); // 入金banner关闭时间
  // const times = storage.getItem('deposit_banner_close_times'); // 入金banner关闭次数

  // useEffect(() => {
  // if (Date.now() - closeTime > noneDepositBannerDuration && times < 3) {
  //   setShowBanner(true);
  // } else {
  //   setShowBanner(false);
  // }

  // old
  // 点击关闭后当天不再展示
  // 关闭3次，连续7天不再展示
  // if (
  //   Date.now() - closeTime < noneDepositBannerDuration ||
  //   (times > 3 && Date.now() - closeTime < noneDepositBannerDuration3Times)
  // ) {
  //   setShowBanner(false);
  // } else {
  //   setShowBanner(true);
  // }
  // }, []);

  const onCloseBanner = (e) => {
    try {
      setShowBanner(false);
      storage.setItem('deposit_banner_close_time', Date.now());
      const times = storage.getItem('deposit_banner_close_times');
      storage.setItem('deposit_banner_close_times', +times + 1);
      trackClick(['depositGuideBanner', '1'], {
        clickPosition: 'close',
      });
      e.stopPropagation && e.stopPropagation();
    } catch (error) {}
  };

  const onCloseDrawer = (flag) => {
    try {
      setShowDrawer(false);
      if (!flag)
        trackClick(['depositGuideChoose', '1'], {
          clickPosition: 'close',
        });
    } catch (error) {}
  };

  const onClickBanner = () => {
    try {
      setShowDrawer(true);
      trackClick(['depositGuideBanner', '1'], {
        clickPosition: 'deposit',
      });
    } catch (error) {}
  };

  if (_.find(noneDepositBannerPage, (i) => _.startsWith(pathname, i))) return null;

  useEffect(() => {
    dispatch({
      type: 'app/update',
      payload: {
        depositBannerShow: recharged === false && isH5 && showBanner,
      },
    });
  }, [recharged, isH5, showBanner, dispatch]);

  // 不展示depositBanner
  if (
    window.location.href &&
    (window.location.href.includes('/pre-market') ||
      window.location.href.includes('/gemvote') ||
      window.location.href.includes('/gemspace') ||
      window.location.href.includes('/gemslot') ||
      window.location.href.includes('/spotlight-center') ||
      window.location.href.includes('/spotlight_r6') ||
      window.location.href.includes('/spotlight7') ||
      window.location.href.includes('/spotlight_r8') ||
      window.location.href.includes('/user-guide') ||
      window.location.href.includes('/gempool'))
  ) {
    return null;
  }
  return depositBannerShow ? (
    <NoSSG>
      <Banner onCloseBanner={onCloseBanner} onClickBanner={onClickBanner} />
      <Drawer show={showDrawer} onCloseDrawer={onCloseDrawer} />
    </NoSSG>
  ) : null;
};
