import LazyImg from '@/components/CommonComponents/LazyImg';
import useTheme from '@/hooks/useTheme';
import { Tooltip } from '@kux/design';
import sensors from 'gbiz-next/sensors';
import React, { memo } from 'react';
import styles from './index.module.scss';
import type { PlatformItemProps } from './types';

import facebookDardIcon from '@/static/community/dark/facebook.png';
import facebookIcon from '@/static/community/light/facebook.png';

import inDarkIcon from '@/static/community/dark/in.png';
import inIcon from '@/static/community/light/in.png';

import insDarkIcon from '@/static/community/dark/ins.png';
import insIcon from '@/static/community/light/ins.png';

import redditDarkIcon from '@/static/community/dark/reddit.png';
import redditIcon from '@/static/community/light/reddit.png';

import xDarkIcon from '@/static/community/dark/x.png';
import xIcon from '@/static/community/light/x.png';

import mediumDarkIcon from '@/static/community/dark/medium.png';
import mediumIcon from '@/static/community/light/medium.png';

import tgDarkIcon from '@/static/community/dark/tg.png';
import tgIcon from '@/static/community/light/tg.png';

import youtubeDarkIcon from '@/static/community/dark/youtube.png';
import youtubeIcon from '@/static/community/light/youtube.png';

import tiktokDarkIcon from '@/static/community/dark/tiktok.png';
import tiktokIcon from '@/static/community/light/tiktok.png';

const Icons = {
  Facebook: {
    light: facebookIcon,
    dark: facebookDardIcon,
  },
  Instagram: {
    light: insIcon,
    dark: insDarkIcon,
  },
  LinkedIn: {
    light: inIcon,
    dark: inDarkIcon,
  },
  Reddit: {
    light: redditIcon,
    dark: redditDarkIcon,
  },
  Twitter: {
    light: xIcon,
    dark: xDarkIcon,
  },
  Medium: {
    light: mediumIcon,
    dark: mediumDarkIcon,
  },
  Telegram: {
    light: tgIcon,
    dark: tgDarkIcon,
  },
  YouTube: {
    light: youtubeIcon,
    dark: youtubeDarkIcon,
  },
  TikTok: {
    light: tiktokIcon,
    dark: tiktokDarkIcon,
  },
};

const getIconUrl = (platform?: string, theme?: string, iconUrl?: string) => {

  if (!platform || !theme) return iconUrl;
  return Icons[platform]?.[theme] || iconUrl;
};

const PlatformItem: React.FC<PlatformItemProps> = ({ platform, items }) => {

  const { theme } = useTheme();

  const stopPropagation = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleRedirect = (url: string) => {
    window.open(url, '_blank');
  };

  // 如果只有一个项目，直接渲染链接
  if (items.length === 1) {
    const { iconUrl, url, platform: platformName } = items[0];

    if (!iconUrl || !url) return null;

    return (
      <div className={styles.platformItemWrapper}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.platformLink}
          aria-label={platformName || platform}
          onClick={e => {
            stopPropagation(e);
            sensors.trackClick(['communityEntry', '1'], { clickPosition: 'specific', contentItem: platform });
            handleRedirect(url);
          }}
        >
          <LazyImg src={getIconUrl(platform, theme, iconUrl)} alt={platformName || platform} className={styles.platformIcon}  />
        </a>
      </div>
    );
  }

  // 如果有多个项目，点击里面小item跳到目标链接
  const tooltipContent = (
    <div data-theme='dark'>
      <div className={styles.tooltipContent}>
        {items.map((item, index) => (
          <div key={item.accountId || index} className={styles.tooltipLink}
            onClick={() => {
              sensors.trackClick(['communityEntry', '1'], {
                clickPosition: 'specific',
                contentItem: item.platform,
              });
              item.url && handleRedirect(item.url);
            }}
          >
            <a
              key={item.id || item.accountId}
              // href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.accountId || item.platform}
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const firstItem = items[0];
  if (!firstItem?.iconUrl) return null;

  return (
    <div className={styles.platformItemWrapper} onClick={stopPropagation}>
      <Tooltip content={tooltipContent} placement="top" trigger="click" className={styles.platformTooltip}>
        <div className={styles.platformIconWrapper}>
          <LazyImg src={getIconUrl(platform, theme, firstItem.iconUrl)} alt={platform} className={styles.platformIcon} />
        </div>
      </Tooltip>
    </div>
  );
};

export default memo(PlatformItem);
