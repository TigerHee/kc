/*
  * owner: borden@kupotech.com
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import { _t, _tHTML } from 'utils/lang';
import { showDatetime } from 'helper';
import voice from '@/utils/voice';
import { TRADEMODE_META, checkIsMargin } from '@/meta/tradeTypes';
import { getTradeMode } from '@/hooks/common/useTradeMode';
import { getTradeType } from '@/hooks/common/useTradeType';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import { CONTROLS_MENU } from './config';
import {
  Container,
  LeftBox,
  VideoWrapper,
  RightBox,
  TimeLine,
  StyledDialog,
  StyledAccordion,
} from './style';

const { AccordionPanel } = StyledAccordion;

const VideoTutorial = React.memo(() => {
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const trackSrcMap = useRef({});
  const isPlayed = useRef(false);
  const dispatch = useDispatch();

  const [activeKey, setActiveKey] = useState(0);

  const currentLang = useSelector(state => state.app.currentLang);
  const layoutIntroductionVisible = useSelector(
    (state) => state.setting.layoutIntroductionVisible,
  );

  const { videoProps, getStackProps } = CONTROLS_MENU[activeKey];

  useEffect(() => {
    if (layoutIntroductionVisible) {
      voice.disable();
      const tradeType = getTradeType();
      const tradeMode = getTradeMode();
      if (checkIsMargin(tradeType) && tradeMode === TRADEMODE_META.keys.MANUAL) {
        setActiveKey(1);
      } else {
        setActiveKey(0);
      }
      return () => {
        voice.enable();
      };
    }
  }, [layoutIntroductionVisible]);

  const fetchTrack = useMemoizedFn(() => {
    const { src: defaultTrackSrc } = getStackProps();
    const { src: trackSrc } = getStackProps(currentLang);
    // fetch function
    const fetchFn = (filePath) => {
      if (trackSrcMap.current[filePath]) {
        trackRef.current.src = trackSrcMap.current[filePath];
        return;
      }
      // 通过将vtt文件转成Data URLs， 以解决字幕文件跨域问题
      fetch(filePath)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            trackSrcMap.current[filePath] = reader.result;
            trackRef.current.src = trackSrcMap.current[filePath];
          };
        })
        .catch((e) => {
          console.log('fetch track file error', e);
          if (filePath !== defaultTrackSrc) {
            fetchFn(defaultTrackSrc);
          }
        });
    };
    fetchFn(trackSrc);
  });

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'setting/update',
      payload: {
        layoutIntroductionVisible: false,
      },
    });
    isPlayed.current = false;
  }, [dispatch]);

  const handleChangeAccordion = useCallback((v) => {
    if (CONTROLS_MENU[v]) {
      isPlayed.current = false;
      setActiveKey(v);
    }
  }, []);

  const handleChangeTime = (time) => {
    // use setTimeout to fixed 'The play() request was interrupted by a call to pause()'
    setTimeout(() => {
      try {
        videoRef.current.currentTime = time / 1000;
        videoRef.current.play();
      } catch (e) {
        console.log('video autoplay error');
      }
    }, 200);
  };

  const handleVideoPlay = () => {
    if (!isPlayed.current) {
      isPlayed.current = true;
      fetchTrack();
    }
  };

  const handleVideoEnd = () => {
    videoRef.current.currentTime = 0;
    // 重新加载视频，以便显示poster
    videoRef.current.load();
  };

  return (
    <StyledDialog
      keyboard
      height="90%"
      size="xlarge"
      footer={null}
      destroyOnClose
      onCancel={handleCancel}
      open={layoutIntroductionVisible}
      title={_t('14Bb6tqqBJT8DXHBgHNUUT')}
    >
      <Container>
        <LeftBox>
          <VideoWrapper>
            <video
              controls
              ref={videoRef}
              preload="metadata"
              playsInline={false}
              alt={`${window._BRAND_NAME_} tutorial`}
              onPlay={handleVideoPlay}
              onEnded={handleVideoEnd}
              {...videoProps}
            >
              <track
                default
                ref={trackRef}
                {...(
                  trackSrcMap.current[currentLang]
                    ? { src: trackSrcMap.current[currentLang] }
                    : null
                )}
              />
            </video>
          </VideoWrapper>
        </LeftBox>
        <RightBox>
          <StyledAccordion
            accordion
            bordered={false}
            activeKey={activeKey}
            onChange={handleChangeAccordion}
          >
            {CONTROLS_MENU.map(({ videoName, videoPoints }, index) => {
              return (
                <AccordionPanel key={index} header={videoName()}>
                  {videoPoints.map(({ intro, time }) => {
                    return (
                      <TimeLine key={time} onClick={() => handleChangeTime(time)}>
                        <span>{intro()}</span>
                        <span className="ml-16">{showDatetime(time, 'mm:ss')}</span>
                      </TimeLine>
                    );
                  })}
                </AccordionPanel>
              );
            })}
          </StyledAccordion>
        </RightBox>
      </Container>
    </StyledDialog>
  );
});

export default VideoTutorial;
