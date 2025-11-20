import { styled } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
import videoPreviewJPG from 'static/ucenter/login_left_banner.jpg';
import videoSourceMP4 from 'static/ucenter/login_left_banner.mp4';

const BannerBox = styled.section`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
`;
const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const BannerVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.showVideo ? 1 : 0)};
`;

const BannerImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.showVideo ? 0 : 1)};
`;

const LeftBanner = ({ children }) => {
  const videoRef = useRef(null);
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
    <BannerBox>
      <Background>
        {/* Poster 图片作为 LCP 元素 */}
        <picture>
          <BannerImage
            src={videoPreviewJPG}
            showVideo={!showImage || showVideo}
            alt="banner background"
            loading="eager"
            fetchPriority="high"
            onLoad={() => {
              setShowImage(true);
            }}
          />
        </picture>

        {/* 视频元素，延迟显示 */}
        <BannerVideo
          ref={videoRef}
          showVideo={showVideo}
          loop
          autoPlay
          muted={true}
          playsInline
          preload="none"
        />
      </Background>
      {children}
    </BannerBox>
  );
};

export default LeftBanner;
