/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import gift from 'static/activity/gift.svg';
import BaseComponent from '../BaseComponent';
import Html from 'components/common/Html';
import { _t } from 'tools/i18n';
import style from './style.less';
import { useLocale } from '@kucoin-base/i18n';

export default ({ rewardRule }) => {
  useLocale();
  return (
    <div className={style.GiftBox}>
      <BaseComponent baseHead={_t('activity.rewards')}>
        <div className={style.gift}>
          <div className={style.imgBox}>
            <img alt="" src={gift} />
          </div>
          <div className={style.text}>
            <Html>{rewardRule}</Html>
          </div>
        </div>
      </BaseComponent>
    </div>
  );
};
