/**
 * Owner: garuda@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';

import { map, isFunction } from 'lodash';

import CopyToClipboard from './CopyToClipboard';
import SaveImage from './SaveImage';

import { getShareButton } from '../config';

const ShareButton = ({
  shareUrl,
  shareTitle,
  onlyShareClick,
  onShareClick,
  onSave,
  onCopy,
  isMobile,
  saveLoading,
}) => {
  const shareButtons = useMemo(() => {
    return getShareButton({ shareUrl, shareTitle, isMobile });
  }, [shareUrl, shareTitle, isMobile]);

  const handleShareClick = useCallback(
    (url, data) => {
      // 如果传入只执行，则 return
      if (isFunction(onlyShareClick)) {
        onlyShareClick({ url, data });
        return;
      }
      if (isFunction(onShareClick)) {
        onShareClick({ url, data });
      }
      if (url) {
        const opened = window.open(url, '_blank');
        // open被拦截，在当前页面打开
        if (!opened) {
          window.location.href = url;
        }
      }
    },
    [onShareClick, onlyShareClick],
  );

  return (
    <div className="share-button-wrapper" isMobile={isMobile}>
      <div className="share-item-wrapper">
        {map(shareButtons, ({ name = '', icon, url }) => (
          <div
            className="share-item"
            key={name}
            onClick={() => {
              handleShareClick(url, { shareTitle, shareUrl, name });
            }}
          >
            <img src={icon} alt={name} />
            <span>{name}</span>
          </div>
        ))}
      </div>
      <div className="share-button-operator">
        <SaveImage saveLoading={saveLoading} onSave={onSave} isMobile={isMobile} />
        <CopyToClipboard text={`${shareTitle} ${shareUrl}`} onCopy={onCopy} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default React.memo(ShareButton);
