/**
 * Owner: odan.ou@kupotech.com
 */
// 储备金率
import React, { memo } from 'react';
import { _t } from 'tools/i18n';
import { showDateTimeByZoneEight } from 'helper';
import { trackClickHandle } from 'utils/gaTrack';
import { DownFile } from 'src/kComponents/Output';
import ReserveRatioCard from './ReserveRatioCard';

const ReserveRatio = (props) => {
  const { data } = props;
  return (
    <div className="rr_content">
      <div className="por_center">
        <div className="por_title">
          {_t('assets.por.currency.reserveRate', { currency: 'KuCoin' })}
        </div>
        {data?.latestAuditDate && (
          <div className="por_title_desc">
            {_t('assets.por.audit.report', {
              auditTime: showDateTimeByZoneEight(data?.latestAuditDate),
            })}
          </div>
        )}
        <div className="por_down">
          {!!data?.auditReportUrl && (
            <DownFile href={data.auditReportUrl} onClick={() => trackClickHandle('downLoadReport')}>
              {_t('assets.por.audit.download')}
            </DownFile>
          )}
        </div>
      </div>
      <div className="rr_list">
        {data?.reserveAsset?.map((item) => (
          <ReserveRatioCard {...item} key={item.currency} />
        ))}
      </div>
    </div>
  );
};

export default memo(ReserveRatio);
