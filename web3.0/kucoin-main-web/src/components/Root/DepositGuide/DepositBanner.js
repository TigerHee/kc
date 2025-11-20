/**
 * Owner: willen@kupotech.com
 */
import React, { useState } from 'react';
import { _t } from 'src/tools/i18n';
import { useMediaQuery } from '@kufox/mui';
import Banner from './components/Banner';
import Drawer from './components/Drawer';
import storage from 'src/utils/storage';
import { noneDepositBannerPage } from './config';
import { trackClick } from 'src/utils/ga';
import { useSelector } from 'src/hooks/useSelector';
import _ from 'lodash';
import NoSSG from 'src/components/NoSSG';

export default ({ pathname }) => {
  // new 2023-06-20 : 一律展示
  const [showBanner, setShowBanner] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const { recharged } = useSelector((state) => state.user);

  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));

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

  return recharged === false && isH5 && showBanner ? (
    <NoSSG>
      <Banner onCloseBanner={onCloseBanner} onClickBanner={onClickBanner} />
      <Drawer show={showDrawer} onCloseDrawer={onCloseDrawer} />
    </NoSSG>
  ) : null;
};
