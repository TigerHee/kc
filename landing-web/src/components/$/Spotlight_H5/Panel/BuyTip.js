/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { _t } from 'utils/lang';
import { useSelector } from 'dva';
import { Icon } from 'antd';
import { Link } from 'components/Router';
import { MAINSITE_HOST } from 'utils/siteConfig';
import { linkToTrade } from 'utils/linkToTrade';
import { px2rem } from 'helper';
import { addLangToPath } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import { useIsMobile } from 'components/Responsive';
import style from './style.less';

const iconStyle = { color: '#EDB66E', width: px2rem(14), height: px2rem(14) };

const BuyTip = ({ quotaCoin }) => {
  const currentLang = useSelector(state => state.app.currentLang);
  const isInApp = useSelector(state => state.app.isInApp);
  const isMobile = useIsMobile();

  const handleClick = useCallback((symbol, evt) => {
    evt.preventDefault();
    if (isMobile) {
      if (isInApp) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/market?symbol=${symbol}`,
          }
        });
        return;
      }
      window.location.href = addLangToPath(`${MAINSITE_HOST}/download`);
      return;
    }
    linkToTrade(symbol, currentLang)
  }, [currentLang, isInApp, isMobile]);

  return (
    <div className={style.buyTip}>
      <Icon type="info-circle" theme="filled" style={iconStyle} />
      <span className={style.tip}>{_t('spotlight.buytip', { coin: quotaCoin })}</span>&nbsp;
      {quotaCoin === 'BTC' ? (
        <a
          onClick={(e) => handleClick('BTC-USDT', e)}
          href="#BTC-USDT"
          // to={`${TRADE_HOST}/spot/BTC-USDT`}
          // onClick={() => { linkToTrade('BTC-USDT', currentLang); }}
        >
          {_t('spotlight.buynow')}
        </a>
      ) : (
        <a
          href='#coin'
          onClick={(e) => handleClick(`${quotaCoin}-BTC`, e)}
          // to={`${TRADE_HOST}/spot/${quotaCoin}-BTC`}
          // onClick={() => { linkToTrade(`${quotaCoin}-BTC`, currentLang); }}
        >
          {_t('spotlight.buynow')}
        </a>
      )}
    </div>
  );
};

export default BuyTip;
