/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-15 11:51:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-01-08 19:43:34
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/SettingsToolbar/TradeSetting/SettingDrawer.js
 * @Description:
 */
/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useEffect, useMemo } from 'react';
import { DrawerWrapper, DrawerCls } from './style';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';

import AlertMarket from './AlertMarket';
import SoundReminder from './SoundReminder';
import SettingList from './SettingList';
import FuturesSettingList from './FuturesSettingList';
import FuturesRiskLimit from './FuturesRiskLimit';
import FuturesAlert from './FuturesAlert';
import FuturesPop from './FuturesPop';
import FuturesPNLAlert from './FuturesPNLAlert';
import { isFuturesNew } from '@/meta/const';
import { _t } from 'utils/lang';

const TITLE_ENUM = {
  1: { title: _t('trd.info.set'), width: '480px' },
  2: { title: _t('market.alert'), width: '560px' },
  3: { title: _t('7raoQR4podfEGaML3HmECr'), width: '480px' },
  4: { title: _t('trade.settingFutures.title'), width: '480px' },
  5: { title: _t('trade.settingPrompt.noticeTitle'), width: '480px' },
  6: { title: _t('trade.settingPrompt.dialogTitle'), width: '480px' },
  7: { title: _t('setting.pnl.alert'), width: '480px' },
};

/**
 * SettingDrawer
 * 第一级 设置
 */
const SettingDrawer = (props) => {
  const { onOk, show, ...restProps } = props;
  const [type, setType] = useState(1);
  const isMobile = useIsH5();

  const renderMap = useMemo(
    () => ({
      1: isFuturesNew() ? (
        <FuturesSettingList onItemClick={(v) => setType(v)} onOk={onOk} />
      ) : (
        <SettingList onItemClick={(v) => setType(v)} onOk={onOk} />
      ),
      2: <AlertMarket onOk={onOk} onCancel={() => setType(1)} />,
      3: <SoundReminder onOk={() => setType(1)} />,
      4: <FuturesRiskLimit onOk={() => setType(1)} />,
      5: <FuturesAlert onOk={() => setType(1)} />,
      6: <FuturesPop onOk={() => setType(1)} />,
      7: <FuturesPNLAlert onOk={() => setType(1)} />,
    }),
    [onOk],
  );

  const { title, width } = TITLE_ENUM[type || 1] || {};

  useEffect(() => {
    if (!show) {
      setType(1);
    }
  }, [show]);

  return (
    <DrawerCls
      anchor="right"
      title={title}
      back={type !== 1}
      onBack={() => setType(1)}
      show={show}
      {...restProps}
    >
      <DrawerWrapper width={isMobile ? '100%' : width}>{renderMap[type]}</DrawerWrapper>
    </DrawerCls>
  );
};

export default memo(SettingDrawer);
