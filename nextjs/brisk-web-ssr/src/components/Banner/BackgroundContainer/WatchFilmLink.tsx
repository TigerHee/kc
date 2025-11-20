import React, { useEffect } from 'react';
import styles from './WatchFilmLink.module.scss';

import { ReactComponent as PlayDark } from '@/static/banner/play_dark.svg';

import { ReactComponent as Play } from '@/static/banner/play_light.svg';
import useTranslation from '@/hooks/useTranslation';
import { trackClick } from 'gbiz-next/sensors';

import useTheme from '@/hooks/useTheme';
import { manualTrack } from '@/tools/ga';

const WatchFilmLink = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const icon = theme === 'dark' ? <PlayDark className={styles.playIcon} /> : <Play className={styles.playIcon} />;
  const handleClick = () => {
    trackClick(['homepageWatchFullFilm', '1']);
  };

  useEffect(() => {
    manualTrack(['homepageWatchFullFilm', '1']);
  }, []);

  return (
    <a
      href="https://www.youtube.com/watch?v=7kpPwaApBk0"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.watchFilmLink}
      onClick={handleClick}
    >
      <span className={styles.linkText}>{t('63022bd4b7694800a626')}</span>
      {icon}
    </a>
  );
};

export default WatchFilmLink;
