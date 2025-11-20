/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-15 11:51:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-13 16:55:52
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/SettingsToolbar/index.js
 * @Description:
 */
/**
 * Owner: Ray.Lee@kupotech.com
 */
import { FUTURES } from '@/meta/const';
import { ReactComponent as Perks } from 'assets/entry.svg';
import { siteCfg } from 'config';
import React, { useCallback } from 'react';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { addLangToPath } from 'src/utils/lang';
import { trackClick } from 'utils/ga';
import { FUTURES_PERKS } from '../../../meta/futuresSensors/trade';

const { MAINSITE_HOST } = siteCfg;

const PerksEntry = () => {
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  const onClick = useCallback(() => {
    const url = addLangToPath(`${MAINSITE_HOST}/futures/perks`);
    trackClick([FUTURES_PERKS, '1']);
    window.open(url);
  }, []);
  if (!isFutures) {
    return <></>;
  }
  const styleCfg = { margin: '0 4px', boxSizing: 'content-box', width: 20, height: 20 };
  return <Perks onClick={onClick} style={styleCfg} />;
};

export default PerksEntry;
