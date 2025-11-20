import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './index.module.scss';

import videoPreview from '@/static/banner/banner_preview.webp';
import videoPreviewJPG from '@/static/banner/banner_preview.jpg';
// import videoSource from '@/static/banner/banner_video.webm';
// import videoSourceMP4 from '@/static/banner/banner_video.mp4';
import { useGlobalStore } from '@/store/global';
import Head from 'next/head';
import { useUserStore } from '@/store/user';
import { getTenantConfig } from '@/tenant';
import WatchFilmLink from './WatchFilmLink';

type Props = { children: ReactNode };
const BackgroundContainer: React.FC<Props> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const isLogin = useUserStore(state => state.isLogin);
  const totalHeaderHeight = useGlobalStore(state => state.totalHeaderHeight);
  const voiceOpen = useGlobalStore(state => state.voiceOpen);
  const tenantConfig = getTenantConfig();

  // 组件加载后延迟加载视频，避免阻塞 LCP
  useEffect(() => {
    const timer = setTimeout(() => {
      loadVideo();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const loadVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    // 动态插入 source
    // const sourceWebM = document.createElement('source');
    // sourceWebM.src = videoSource;
    // sourceWebM.type = 'video/webm';

    const sourceMP4 = document.createElement('source');
    tenantConfig
      .bannerVideo()
      .then(source => {
        sourceMP4.src = source?.default;
        sourceMP4.type = 'video/mp4';
        video.appendChild(sourceMP4);
      })
      .catch(error => {
        console.error('show video load error:', error);
      });

    video.addEventListener(
      'loadeddata',
      () => {
        // 视频准备好后再显示，确保平滑过渡
        setTimeout(() => {
          setShowVideo(true);
        }, 50);
      },
      { once: true }
    );
  };

  // 为了解决在 ssr 时，pc和h5 高度不一样的问题；在 ssr 的时候，直接走 css 的 height；
  const bannerStyle = totalHeaderHeight
    ? {
        height: `calc(100vh - ${totalHeaderHeight}px)`,
      }
    : {};

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={videoPreview}
          as="image"
          type="image/webp"
          // 提高 poster 图片的优先级
          fetchPriority="high"
        />
      </Head>
      <section className={styles.bannerBox} style={bannerStyle}>
        <div className={styles.backgound}>
          <div className={styles.maskLayer} />

          {/* Poster 图片作为 LCP 元素 */}
          <picture>
            <source srcSet={videoPreview} type="image/webp" />
            <img
              src={videoPreviewJPG}
              alt="banner background"
              className={`${styles.bannerImage} ${showVideo ? styles.fadeOut : ''}`}
              loading="eager"
              fetchPriority="high"
            />
          </picture>

          {/* 视频元素，延迟显示 */}
          <video
            ref={videoRef}
            className={`${styles.bannerVideo} ${showVideo ? styles.fadeIn : styles.hidden}`}
            loop
            autoPlay
            muted={!voiceOpen}
            playsInline
            preload="none"
          />
        </div>
        {children}
        {isLogin && tenantConfig.showFilmEntry && <WatchFilmLink />}
      </section>
    </>
  );
};

export default BackgroundContainer;
