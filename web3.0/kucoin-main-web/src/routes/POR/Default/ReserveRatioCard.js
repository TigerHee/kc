/**
 * Owner: odan.ou@kupotech.com
 */

import React from 'react';
import { _t } from 'tools/i18n';
import { separateNumber } from 'helper';
import styles from './rrCard.less';

/**
 * 储备金率卡片
 * @param {{
 *   userAsset: string,
 *   walletAsset: string,
 *   reserveRate: string,
 *   currencyName: string,
 *   icon: string,
 *   brIndex: number,
 * }} props
 */
const ReserveRatioCard = (props) => {
  const { icon, currency, reserveRate, userAsset, walletAsset, brIndex } = props;
  const rateVal = reserveRate
    ? String(reserveRate).endsWith('%')
      ? reserveRate
      : `${reserveRate}%`
    : '--';
  const userAssetStr = separateNumber(userAsset);
  const walletAssetStr = separateNumber(walletAsset);
  return (
    <div className={styles.rr_card_wrap}>
      <div className="rr_card">
        <div className="rr_info">
          <img alt="" src={icon} className="rr_img" />
          <span className="rr_coin_reserve">
            {_t('assets.por.currency.reserveRate', { currency })}
          </span>
          <span className="rr_rate">{rateVal}</span>
        </div>
        <div className="rr_assets rr_card_bb" style={{ borderImageSource: `url(${icon})` }}>
          <div>
            <div>{_t('assets.por.userAsset')}</div>
            <div>
              <span title={userAssetStr}>{userAssetStr}</span>
            </div>
          </div>
          <div>
            <div>{_t('assets.por.walletAsset')}</div>
            <div>
              <span title={walletAssetStr}>{walletAssetStr}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveRatioCard;
