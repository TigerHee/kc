import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { ReactComponent as PlayDark } from '@/static/banner/play_dark.svg';

import { ReactComponent as Play } from '@/static/banner/play_light.svg';
import useTranslation from '@/hooks/useTranslation';

import { Button } from '@kux/design';
import useTheme from '@/hooks/useTheme';
import { trackClick } from 'gbiz-next/sensors';
import { manualTrack } from '@/tools/ga';

const WatchFilmButton = () => {
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
      className={styles.watchFilmBtnBox}
      onClick={handleClick}
    >
      <Button size="huge" type="outlined" endIcon={icon} className={styles.watchFilmBtn}>
        {t('63022bd4b7694800a626')}
      </Button>
    </a>
  );
};

export default WatchFilmButton;
