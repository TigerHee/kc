/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'dva';

import { VideoWrapper } from './StyledComps';

const VideoPlay = ({ videoSrc }) => {
  const { isInApp } = useSelector(state => state.app);
  const videoRef = useRef(null);
  const tsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (tsRef.current) {
        clearTimeout(tsRef.current);
        tsRef.current = null;
      }
    };
  }, []);

  // 视频的兼容处理
  const videoSetting = useMemo(
    () => ({
      controls: true,
      autoPlay: false,
      preload: 'metadata',
      controlsList: isInApp ? 'nodownload' : '',
      muted: true,
      playsInline: false,
      loop: false,
      alt: 'kucoin brand broker',
      src: videoSrc,
      ref: videoRef,
    }),
    [isInApp, videoSrc],
  );
  return (
    <VideoWrapper>
      <video inspector="video" {...videoSetting}>
        Your browser does not support the video tag.
      </video>
    </VideoWrapper>
  );
};

VideoPlay.propTypes = {
  videoSrc: PropTypes.string.isRequired, // 视频链接
};

VideoPlay.defaultProps = {
  videoSrc: 'https://assets.staticimg.com/static/video/2022/09/ETH-Merge30.mp4',
};

export default VideoPlay;
