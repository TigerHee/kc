/**
 * Owner: ella.wang@kupotech.com
 */
import React, { useCallback } from 'react';
import { ga, trackClick } from 'utils/ga';
import { _t } from 'tools/i18n';
import { ShareWrapper, ShareTitle, ShareContent, ShareImage } from './index.style';
import { getShareList } from './config';

export default ({ mb = 0, responseFlex = true, blockid, shareTitle = '' }) => {
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

  const shareList = getShareList(window.location.href, shareTitle);
  return (
    <ShareWrapper mb={mb} responseFlex={responseFlex}>
      <ShareTitle>{_t('blog.share')}</ShareTitle>
      <ShareContent>
        {shareList.map((item) => {
          return (
            <ShareImage
              src={item.icon}
              key={item.name}
              onClick={() => handleShare(item)}
              responseFlex={responseFlex}
            />
          );
        })}
      </ShareContent>
    </ShareWrapper>
  );
};
