/**
 * Owner: garuda@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';

import { evtEmitter as eventEmmiter } from 'helper';
import { greaterThan, greaterThanOrEqualTo } from 'utils/operation';

import { useGetShareInfo } from '../hook';

const eventHandle = eventEmmiter.getEvt();
const ShareBackground = () => {
  const shareInfo = useGetShareInfo();
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    let imageName = 'loss.jpg';
    if (greaterThan(shareInfo?.roe)(0)) {
      imageName = greaterThanOrEqualTo(shareInfo?.roe)(0.3) ? 'high-profit.jpg' : `profit.jpg`;
    }
    import(`@/assets/share/pnlShare/${imageName}`)
      .then((image) => {
        setImagePath(image.default);
      })

      .catch((err) => {
        console.error('Error loading image:', err);
      });
  }, [shareInfo]);

  const handleImageLoad = useCallback(() => {
    eventHandle.emit('event/futures@pnlShareImageLoad', true);
  }, []);

  if (!imagePath || !shareInfo) {
    return <div className="img-background" />;
  }

  return (
    <img className="img-background" src={imagePath} alt="background" onLoad={handleImageLoad} />
  );
};

export default React.memo(ShareBackground);
