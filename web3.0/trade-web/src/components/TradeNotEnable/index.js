/**
 * Owner: borden@kupotech.com
 */

import React from 'react';
import { _t } from 'utils/lang';
import { isMaintenanceScope, isSymbolMaintenance } from 'utils/noticeUtils';
import styles from './styles/style.less';
import notTradingSvg from 'assets/notenable_trading.svg';

const TradeNotEnable = (props) => {
  const { tipKey, tip, announcement = {}, symbolCode } = props;
  const _tip = tipKey ? _t(tipKey) : tip;
  const isMaintenanceTrade = isMaintenanceScope(announcement);
  const symbolMaintenance = isSymbolMaintenance(announcement, symbolCode);
  return (
    <div className={styles.withdrawPanel}>
      <div className="text-center">
        <img src={notTradingSvg} />
        <div>
          {_tip}
        </div>
        {
          symbolMaintenance && isMaintenanceTrade && !!announcement.link && (
            <div className={styles.maintenanceLinkBtn}>
              <a
                target="_blank"
                href={announcement.link}
                rel="noopener noreferrer"
              >{announcement.redirectContent || _t('view.more')}</a>
            </div>
          )
        }
        {/* 兼容已有展示样式 */}
        {
          symbolMaintenance && !isMaintenanceTrade && !!announcement.title && (
            <div className={styles.announcement}>
              {_t('maintenance.tip.announcement')}
              <a
                target="_blank"
                href={announcement.link}
                rel="noopener noreferrer"
              >{announcement.title}</a>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default TradeNotEnable;
