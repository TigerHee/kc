/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';
import { isIOS } from 'helper';
import { TUTORIAL_TITLE_CONFIG } from '../config';
import styles from './style.less';

const ParticipationTutorial = ({ namespace = 'luckydrawTurkey' }) => {
  const { isInApp } = useSelector(state => state.app);
  const { videoUrl } = useSelector(state => state[namespace].config);
  const config = TUTORIAL_TITLE_CONFIG[namespace];

  // 视频的兼容处理
  const videoSetting = useMemo(
    () => ({
      controls: true,
      autoPlay: !isIOS(),
      controlslist: isInApp ? 'nodownload' : '',
      muted: true,
      poster: isIOS() ? config.poster : '',
    }),
    [isInApp, config],
  );

  return !!videoUrl ? (
    <div className={styles.container}>
      <h2 className={styles.title}>{config.title}</h2>
      <div className={styles.videoContainer}>
        <video inspector="video" className={styles.video} src={videoUrl} {...videoSetting}>
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  ) : null;
};

export default ParticipationTutorial;
