import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import videoPreviewJPG from './img/login_left_banner.jpg';
import videoSourceMP4 from './img/login_left_banner.mp4';
import styles from './index.module.scss';

const LoginBanner = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // 组件加载后延迟加载视频，避免阻塞 LCP
  useEffect(() => {
    const timer = setTimeout(() => {
      loadVideo();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const loadVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    const sourceMP4 = document.createElement('source');
    sourceMP4.src = videoSourceMP4;
    sourceMP4.type = 'video/mp4';

    // video.appendChild(sourceWebM);
    video.appendChild(sourceMP4);

    video.addEventListener(
      'loadeddata',
      () => {
        // 视频准备好后再显示，确保平滑过渡
        setTimeout(() => {
          setShowVideo(true);
        }, 50);
      },
      { once: true },
    );
  };

  return (
    <section className={styles.bannerBox}>
      <div className={styles.background}>
        {/* Poster 图片作为 LCP 元素 */}
        <picture>
          <img
            className={clsx(styles.bannerImage, {
              [styles.showVideo]: !showImage || showVideo,
            })}
            src={videoPreviewJPG}
            alt="banner background"
            loading="eager"
            fetchPriority="high"
            onLoad={() => {
              setShowImage(true);
            }}
          />
        </picture>

        {/* 视频元素，延迟显示 */}
        <video
          className={clsx(styles.bannerVideo, showVideo && styles.showVideo)}
          ref={videoRef}
          loop
          autoPlay
          muted={true}
          playsInline
          preload="none"
        />
      </div>
    </section>
  );
};

export default LoginBanner;
