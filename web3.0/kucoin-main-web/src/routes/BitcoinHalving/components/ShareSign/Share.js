/**
 * Owner: ella.wang@kupotech.com
 */
import React, { useCallback } from 'react';
import { Tooltip, useResponsive } from '@kux/mui';
import { ga, trackClick } from 'utils/ga';
import { useLocale } from '@kucoin-base/i18n';
import { _t } from 'tools/i18n';
import { ShareWrapper, ShareTitle, ShareContent, ShareImage } from './Share.style';
import { getShareList } from './config';

export default ({ blockid, staticGap = false }) => {
  const responsive = useResponsive();
  const { currentLang } = useLocale();

  const handleShare = useCallback(
    ({ gaKey, contentType, url }) => {
      ga(gaKey);
      // 神策埋点
      if (blockid) {
        trackClick([blockid, '1'], { contentType });
      }
      const newWindow = window.open(url);
      newWindow.opener = null;
    },
    [blockid],
  );

  const shareList = getShareList(window.location.href, 'What Is Bitcoin Halving? ');
  return (
    <ShareWrapper>
      {responsive.sm && <ShareTitle>{_t('blog.share')}</ShareTitle>}
      <ShareContent staticGap={staticGap} isEn={currentLang === 'en_US'}>
        {shareList.map((item) => {
          return (
            <Tooltip key={item.name} title={item.name}>
              <ShareImage src={item.icon} onClick={() => handleShare(item)} />
            </Tooltip>
          );
        })}
      </ShareContent>
    </ShareWrapper>
  );
};
