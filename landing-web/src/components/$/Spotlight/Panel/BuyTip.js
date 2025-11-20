/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { _t } from 'utils/lang';
import { useSelector } from 'dva';
import { Icon } from 'antd';
import { Link } from 'components/Router';
import { TRADE_HOST } from 'utils/siteConfig';
import { linkToTrade } from 'utils/linkToTrade';
import style from './style.less';

const iconStyle = { color: '#FF5F73', width: 18, height: 18 };

const BuyTip = ({ quotaCoin }) => {
  const { currentLang } = useSelector(state => state.app.currentLang);
  return (
    <div className={style.buyTip}>
      <Icon type="info-circle" theme="filled" style={iconStyle} />
      <span className={style.tip}>{_t('spotlight.buytip', { coin: quotaCoin })}</span>&nbsp;
      {quotaCoin === 'BTC' ? (
        <Link
          to={`${TRADE_HOST}/BTC-USDT`}
          onClick={() => { linkToTrade('BTC-USDT', currentLang); }}
        >
          {_t('spotlight.buynow')}
        </Link>
      ) : (
        <Link
          to={`${TRADE_HOST}/${quotaCoin}-BTC`}
          onClick={() => { linkToTrade(`${quotaCoin}-BTC`, currentLang); }}
        >
          {_t('spotlight.buynow')}
        </Link>
      )}
    </div>
  );
};

export default BuyTip;
