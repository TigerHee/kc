/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { _t } from 'tools/i18n';
import CardList from './cardList';

/**
 * 证明卡片
 * @param {{
 *  onLogin(): void,
 *  scope: string,
 * }} props
 */
const Proof = (props) => {
  return (
    <div>
      <div className="por_center">
        <div className="por_title">{_t('assets.por.audit.accountAssets')}</div>
        <div className="por_title_desc">{_t('assets.por.audit.totalAssets')}</div>
      </div>
      <div>
        <CardList {...props} />
      </div>
    </div>
  );
};

export default memo(Proof);
