/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-27 13:34:18
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-24 17:11:05
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/SettingsToolbar/News/index.js
 * @Description:
 */
/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useCallback } from 'react';
import { useSelector } from 'dva';
import IconLabel from '../IconLabel';
import Dropdown from '@mui/Dropdown';
import Overlay from './Overlay';
import { _t } from 'utils/lang';
import { commonSensorsFunc } from '@/meta/sensors';

/**
 * News
 * 新闻模块
 */
const News = (props) => {
  const infoBarMediaFlag = useSelector(state => state.setting.infoBarMediaFlag);

  const handleDropdown = useCallback((v) => {
    if (v) {
      commonSensorsFunc(['tradeZoneFunctionArea', 'news', 'click']);
    }
  }, []);

  return (
    <Dropdown
      {...props}
      height="auto"
      trigger="click"
      contentPadding={0}
      overlay={<Overlay />}
      title={_t('nav.topNews.tip')}
      onVisibleChange={handleDropdown}
    >
      <IconLabel
        icon="news"
        disabledOnMobile
        className="ml-10"
        text={_t('nav.topNews.tip')}
        showText={infoBarMediaFlag < 0}
      />
    </Dropdown>
  );
};

export default memo(News);
