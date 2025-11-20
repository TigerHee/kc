import React, { useEffect, type ReactNode } from 'react';
import { useTheme } from '@kux/design';
import { trackClick } from 'tools/sensors';
import { BannerType, type NavigationBanner } from '../types';
import styles from './Banner.module.scss';
import clsx from 'clsx';
import { Button } from '@kux/design';
import AnimatedContent from 'packages/header/components/AnimatedContent';
import { kcsensorsManualTrack } from 'packages/header/common/tools';

type Props = {
  isTwoBanner?: boolean;
  item: NavigationBanner;
  className?: string;
  showIndex?: number;
};
const Banner: React.FC<Props> = ({ isTwoBanner, item, showIndex = 0, className }) => {
  let content: ReactNode = null;
  const currentTheme = useTheme();

  const name = item?.srcTextMap.name || '';
  const explain = item?.srcTextMap.explain || '';
  const webUrl = item?.webUrl || '';
  const itemId = item?.id || '';

  const handleFunctionRedirect = e => {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = webUrl;
    trackClick(['navigationDropLeftBotton', '1'], {
      id: itemId,
      url: webUrl,
    });
  };

  let delay = 0.1;
  if (item?.bannerType === BannerType.function) {
    // 功能资源位
    const buttonText = item?.srcTextMap.buttonText || '';
    content = (
      <div className={clsx([styles.banner, className])}>
        <div className={styles.functionTitle}>{name}</div>
        <div className={styles.functionDesc}>{explain}</div>
        <Button className={styles.functionButton} type="primary" size="large" onClick={handleFunctionRedirect}>
          {buttonText}
        </Button>
      </div>
    );
  } else {
    delay = 0.2;
    // 活动资源位
    const category = item?.srcTextMap.category || '';
    const imgSrc = currentTheme === 'light' ? item?.daySrcImgMap?.img : item?.nightSrcImgMap?.img;
    const imgAlt = item?.imgAlt;
    content = (
      <div className={clsx([styles.banner, className, styles.pointer, styles.activityBanner])}>
        <div className={styles.activityTitle}>{category}</div>
        <div className={styles.imageBox}>
          <img className={styles.activityImage} src={imgSrc} alt={imgAlt} />
        </div>
        <div className={styles.activityName}>{name}</div>
        <div className={styles.activityDesc}>{explain}</div>
      </div>
    );
  }

  useEffect(() => {
    // 功能资源位曝光事件
    if (item?.bannerType === BannerType.function) {
      kcsensorsManualTrack(['navigationDropLeftBotton', '1'], {
        id: itemId,
        url: webUrl,
      });
    }

    // 活动资源位曝光事件
    if (item?.bannerType === BannerType.activity) {
      kcsensorsManualTrack(['navigationDropRightBanner', '1'], {
        id: itemId,
        url: webUrl,
      });
    }
  }, []);

  return (
    <div className={styles.bannerContainer}>
      <AnimatedContent delay={delay}>{content}</AnimatedContent>
    </div>
  );
};

export default Banner;
