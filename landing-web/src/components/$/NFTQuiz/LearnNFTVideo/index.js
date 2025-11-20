/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { styled } from '@kufox/mui/emotion';
import { useEventCallback } from '@kufox/mui/hooks';
import { Spin } from '@kufox/mui';
import { px2rem as _r } from '@kufox/mui/utils';
import { _t, _tHTML } from 'utils/lang';
import { size } from 'lodash';
import { NFT_QUIZ_STATUS } from 'config';
import { numberFixed, Event, openPage, isIOS } from 'helper';
import { sensors } from 'utils/sensors';
import TipDialog from 'components/$/NFTQuiz/Tip';
import { NFT_QUIZ_TYPES as TYPES } from 'config';
import { useQuizContext } from '../context';


const docUrl = 'https://docs.fracton.cool/overview/fracton-protocol';

const Title = styled.section`
  margin-top: ${_r(24)};
  margin-bottom: ${_r(8)};
  padding: 0 ${_r(16)};
  font-weight: 500;
  font-size: ${_r(20)};
  color: #fff;
`;

const Desc = styled.section`
  padding: 0 ${_r(16)};
  margin-bottom: ${_r(24)};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  > p {
    margin-bottom: 0;
  }
  .link {
    color: rgba(128, 220, 17, 1);
    cursor: pointer;
    text-decoration: underline;
    margin-top: ${_r(6)};
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${_r(211)};
  > video {
    width: 100%;
    height: 100%;
  }
`;

const SpinWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TipWrapper = styled.section`
  background: rgba(0, 0, 0, 0.4);
  padding: ${_r(10)} ${_r(16)};
`;

const CountDownTitle = styled.p`
  font-size: ${_r(14)};
  line-height: ${_r(22)};
  color: #fff;
  margin-bottom: 0;
  .className {
    color: #80DC11;
  }
`;

const LearnTip = styled.p`
  margin-bottom: 0;
  font-weight: 400;
  font-size: ${_r(12)};
  line-height: ${_r(22)};
  color: rgba(255, 255, 255, 0.4);
  .className {
    color: #80DC11;
  }
`;

const TipDialogContent = styled.p`
  .className {
    color: #80DC11;
  }
`;

const LearnNFTVideo = () => {
  const {
    todayAnswerInfo,
    activityConfig,
    dispatch,
    isLogin,
    isMobile,
    isInApp,
    currentLang,
    viewType,
  } = useQuizContext();
  const { learningTask, learningQuestPrize } = todayAnswerInfo || {};
  const { activityStatus, config, learnVideoUrl: videoUrl } = activityConfig || {};

  /**
   * 是否开启倒计时，只有活动中才需要开启，且未
   */
  const [isStartCountDown, isShowTip] = useMemo(() => {
    const isBegin = activityStatus === NFT_QUIZ_STATUS.CURRENT;
    const startDown = isBegin && !learningTask && size(config) > 0;
    const showTip = ((isBegin && size(config) > 0) || !!learningQuestPrize);
    return [startDown, showTip];
  }, [learningTask, activityStatus, learningQuestPrize, config]);

  const playUrl = isIOS() ? `${videoUrl}#t=0.1` : videoUrl ;

  const videoRef = useRef(null);
  const countDownInterval = useRef(null);
  const videoPauseCompensate = useRef(1);
  const hasStart = useRef(false);
  const pauseRef = useRef(null);
  const countedRef = useRef(0);

  const [videoDuration, updateDuration] = useState(0);
  const [tipVisible, updateVisible] = useState({open: false, data: null });


  const doHidden = isInApp && !isIOS();
  const [hiddenVideo, updateHiddenVideo] = useState(doHidden);

  const toggleVisible = useEventCallback(() => {
    updateVisible(data => ({
      ...data,
      open: !data.open,
    }));
    // 刷新视频抽奖记录
    if (activityConfig?.currentId && isLogin) {
      // 获取当天答题情况
      dispatch({
        type: 'nftQuiz/getTodayAnswerInfo',
        payload: {
          id: activityConfig.currentId,
        }
      });
    }
    sensors.trackClick(['OK', '1']);
  });

  const handleStart = useEventCallback(() => {
    if (!isStartCountDown) return;
    if (videoDuration === 0 && !hasStart.current) {
      // 尝试获取视频长度
      if (videoRef.current?.duration) {
        updateDuration(Math.floor(videoRef.current.duration));
      }
    }
    // 开启倒计时
    if (pauseRef.current) {
      clearTimeout(pauseRef.current);
      pauseRef.current = null;
    }
    clearInterval(countDownInterval.current);
    countDownInterval.current = setInterval(() => {
      updateDuration(duration => {
        const len = duration - 1;
        if (len >= 0 ) {
          countedRef.current += 1;
        }
        return len >= 0 ? len : 0;
      });
    }, 1000);
    hasStart.current = true;
  });

  const handlePause = useEventCallback(() => {
    if (!isStartCountDown) return;
    pauseRef.current = setTimeout(() => {
      if (countDownInterval.current) {
        clearInterval(countDownInterval.current);
        countDownInterval.current = null;
      };
      pauseRef.current = null;
    }, 200);
    videoPauseCompensate.current += 1;
  });

  const handleEnd = useEventCallback(() => {
    if (!isStartCountDown) return;
    const video = videoRef.current;
    const isVideoInEnd = video.currentTime == video.duration;
    const hasCountHalf = countedRef.current > video.duration / 2;
    if (isVideoInEnd && videoDuration > 0 && !hasCountHalf) {
      clearInterval(countDownInterval.current);
      countDownInterval.current = null;
      return;
    };
    if (pauseRef.current) {
      // 继续倒计时
      clearTimeout(pauseRef.current);
      pauseRef.current = null;
    }
  });

  const getVideoBase64 = useCallback((url) => new Promise((resolve, reject) => {
    try {
      let dataURL = '';
      const video = document.createElement('video');
      video.setAttribute('crossOrigin', 'anonymous');
      // 处理跨域
      video.setAttribute('src', url);
      video.setAttribute('preload', 'auto');
      Event.addHandler(video, 'loaded', function () {
        const canvas = document.createElement('canvas');
        // 视频高
        const videoInner = videoRef.current;

        const width = videoInner?.clientWidth;
        // canvas的尺寸和图片一样
        const height = videoInner?.clientHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(video, 0, 0, width, height);
        // 绘制canvas
        dataURL = canvas.toDataURL('image/jpeg');
        // 转换为base64
        resolve(dataURL);
      });
    } catch (e) {
      reject(e);
    }
  }), []);

  const addPoster = useCallback(async () => {
    try {
      const video = videoRef.current;
      if (!video) {
        updateHiddenVideo(false);
        return;
      }
      const urlImg = await getVideoBase64(videoUrl);
      video.setAttribute('poster', urlImg);
      updateHiddenVideo(false);
    } catch (e) {
      console.error(e);
      updateHiddenVideo(false);
    }
  }, []);

  const loadedmetadata = useEventCallback(() => {
    if (videoRef.current?.duration) {
      updateDuration(Math.floor(videoRef.current.duration));
    }
  });

  useEffect(async () => {
    if (videoDuration === 0 && hasStart.current && isStartCountDown) {
      // 倒计时完毕，清除interval
      clearInterval(countDownInterval.current);
      countDownInterval.current = null;
      // 发起视频学习抽奖申请
      const data = await dispatch({
        type: 'nftQuiz/applyLearnBouns',
      });
      if (data) {
        // 申请成功，界面弹窗并刷新数据
        updateVisible({
          open: true,
          data,
        });
      }
    }
  }, [videoDuration, isStartCountDown]);

  // 页面卸载，释放相关引用
  useEffect(() => {
    return () => {
      if (countDownInterval.current) {
        clearInterval(countDownInterval.current);
        clearTimeout(pauseRef.current);
        countDownInterval.current = null;
        pauseRef.current = null;
        videoPauseCompensate.current = 0;
      };
      if (videoRef.current) videoRef.current = null;
    }
  }, []);

  const cancelHidden = useEventCallback(() => {
    if (hiddenVideo) {
      updateHiddenVideo(false);
    }
  });

  useEffect(() => {
    if (doHidden) {
      setTimeout(() => {
        cancelHidden();
      }, 1500);
    }
  }, [doHidden]);
  // 注册事件
  useEffect(() => {
    addPoster();
    setTimeout(() => {
      if (!videoRef.current) return;
      Event.addHandler(videoRef.current, 'play', handleStart);
      Event.addHandler(videoRef.current, 'pause', handlePause);
      Event.addHandler(videoRef.current, 'ended', handleEnd);
      Event.addHandler(videoRef.current, 'loadedmetadata', loadedmetadata);
    }, 0);
    return () => {
      if (videoRef?.current) {
        Event.removeHandler(videoRef.current, 'play', handleStart);
        Event.removeHandler(videoRef.current, 'pause', handlePause);
        Event.removeHandler(videoRef.current, 'ended', handleEnd);
        Event.removeHandler(videoRef.current, 'loadedmetadata', loadedmetadata);
      }
    }
  }, []);

  const titleTxt = useMemo(() => {
    if (isStartCountDown) {
      return (
        _tHTML('qK4doMr84vgMnCXLEyXqS3', {
          CountNumber: videoDuration
        })
      )
    } else if (isShowTip) {
      return _t('smWxBNYgSgtCj8r4FtD8N6');
    }
    return null;
  }, [isStartCountDown, videoDuration, isShowTip]);

  const tipTxt = useMemo(() => {
    if (isStartCountDown) return _t('2cX6wxCFk1wZYpzGCHhu9e');
    const { winPrize, currency, amount } = learningQuestPrize || {};
    if (isShowTip) return winPrize ? 
        _tHTML('oCRa1WPM2mvuXBYqxTz3is', {
          Number2: numberFixed(amount || 0, 2),
          TokenName: currency,
        })
    : _t('2WMcyQmDwhq9UBUGw7b4Yw');
    return null;
  }, [isStartCountDown, learningQuestPrize, isShowTip]);

  let tipContent = isShowTip && (
    <TipWrapper>
      <CountDownTitle>
        {titleTxt}
      </CountDownTitle>
      <LearnTip>
        {tipTxt}
      </LearnTip>
    </TipWrapper>
  );

  const learnApplyTip = useMemo(() => {
    const { data } = tipVisible;
    const { amount, currency, winPrize } = data || {};
    if (winPrize) {
      return (
        <TipDialogContent>
          {_tHTML('vWbbvGPt94RiVv4GriPYwM', {
            Number2: numberFixed(amount || 0, 2),
            TokenName: currency
          })}
        </TipDialogContent>
      );
    } else {
      return _t('k56JkBXcEVvJENXEYcnWLY');
    }
  }, [tipVisible]);

  const gotoDoc = useEventCallback(() => {
    openPage(isInApp, docUrl);
    sensors.trackClick(['WhitePaper', '1'], {
      language: currentLang,
    });
  });

  const isCurrent = viewType === TYPES.LEARN;
  if (!isCurrent) return null;

  return (
    <>
      <Title>
        {_t('5RfZZznc5n9N6kyoEcWoDJ')}
      </Title>
      <Desc>
        <p>{_t('5zwPLz8MrNagvQHDz5xB3t')}</p>
        <p className='link' onClick={gotoDoc}>
          {_t('tcp3TmnrHcBXraRawXywAJ')}
        </p>
      </Desc>
      <VideoWrapper>
        {
          hiddenVideo && (
            <SpinWrapper>
              <Spin spinning />
            </SpinWrapper>
          )
        }
        <video
          controls
          width="100%"
          ref={videoRef}
          preload="auto"
          style={{
            visibility: hiddenVideo ? 'hidden' : 'visible',
          }}
        >
          <source src={playUrl} type="video/mp4" />
          <track kind="captions" />
        </video>
      </VideoWrapper>
      {tipContent}
      {
        tipVisible.open ? (
          <TipDialog
            open={tipVisible.open}
            size={isMobile ? 'mini' : 'basic'}
            showCloseX={false}
            title={_t('kvDNW8NgjUQYG1Lt2rfiyQ')}
            onOk={toggleVisible}
            onCancel={toggleVisible}
            cancelText={null}
            okText={_t('4WBmfMFMCWHZ11MrTEYo59')}
          >
            {learnApplyTip}
          </TipDialog>
        ) : null
      }
    </>
  );
};

export default LearnNFTVideo;