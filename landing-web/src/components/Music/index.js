/**
 * Owner: melon@kupotech.com
 */
import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { styled, keyframes, css } from '@kux/mui/emotion';
import MusicOpenSvg from './assets/music-open.svg';
import MusicCloseSvg from './assets/music-close.svg';
import { useEventCallback } from '@kux/mui/hooks';
import { reportAudioError } from 'utils/sentry';

const turn = keyframes`
  from{
      transform: rotate(0deg);
  }
  to{
      transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  audio {
    visibility: hidden;
  }
`;
const MusicContent = styled.div`
  cursor: pointer;
`;
const Music = styled.img`
  width: 26px;
  height: 26px;
  margin-left: 16px;
  cursor: pointer;
  animation: ${(props) =>
    props?.needAnimation && props?.playing
      ? css`
          ${turn} 6s infinite linear
        `
      : 'none'};
  [dir='rtl'] & {
    /* @noflip */
    margin-right: 16px;
    /* @noflip */
    margin-left: unset;
  }
`;

// 音乐播放组件
// 使用场景 - 活动页面需要背景音乐播放,
// 谷歌浏览器/safari不支持音频自动播放，必须在用户和页面进行互动后再开启播放 所以没有办法做到
// 支持 单次播放/循环播放； 支持传入背景音乐； 支持传入 开启/关闭音乐时的图片
// 支持点击图片 开启 or 播放音乐
const Index = ({
  src,
  currentRef,
  musicImg,
  musicCloseImg,
  onClickMusic,
  onMusicEnd,
  playingMusicContent,
  pauseMusicContent,
  loop,
  classes,
  audioProps,
  audioId,
  needAnimation,
  canPlayHandle,
  errorHandle,
}) => {
  const tsRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return () => {
      if (tsRef.current) {
        clearTimeout(tsRef.current);
        tsRef.current = null;
      }
    };
  }, []);

  // 可以播放
  const onCanPlay = useEventCallback(() => {
    if (!ready) {
      console.log('start======> :audio ready ======>end');
      setReady(true);
      isFunction(canPlayHandle) && canPlayHandle();
    }
  });
  // 播放结束
  const handleEnd = useEventCallback(() => {
    console.log('start======> :audio end ======>end');
    if (!loop && isFunction(onMusicEnd)) {
      onMusicEnd();
    }
  });

  // 点击音乐图标
  const onClick = useCallback(() => {
    try {
      if (playing) {
        currentRef.current.pause();
      } else {
        currentRef.current.play();
      }
      if (isFunction(onClickMusic)) {
        onClickMusic();
      }
    } catch (error) {
      console.error(`MusicContent Error is:`, error);
    }
  }, [onClickMusic, currentRef, playing]);
  // 失败回调
  const onError = useCallback(
    (event) => {
      try {
        const { target } = event || {};
        const { currentSrc, error = {} } = target || {};
        reportAudioError({ url: currentSrc, errorMessage: error.message, errorCode: error.code });
        setReady(false);
        isFunction(errorHandle) && errorHandle();
      } catch (error) {
        console.error(`MusicContent onError is:`, error);
      }
    },
    [reportAudioError, errorHandle],
  );
  useEffect(() => {
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.load(); // 解决ios 不会主动触发 onCanPlay，IOS端在执行paly的时候才会触发 oncanplay
      audio.addEventListener('playing', function () {
        setPlaying(true);
      });
      // 获取音频资源加载状态
      const doReady = setInterval(function () {
        if (audio.readyState === 4) {
          onCanPlay();
          clearInterval(doReady);
        }
      }, 100);
      audio.addEventListener('pause', function () {
        setPlaying(false);
      });
      audio.addEventListener('canplay', function () {
        onCanPlay();
      });
      return () => {
        audio.removeEventListener('playing', function () {
          setPlaying(true);
        });
        audio.removeEventListener('pause', function () {
          setPlaying(false);
        });
        audio.removeEventListener('canplay', function () {
          onCanPlay();
        });
      };
    }
  }, [setPlaying, currentRef, audioId, onCanPlay]);

  // 获取播放中展示
  const getPlayingContent = useMemo(() => {
    return (
      playingMusicContent || (
        <Music playing={playing} needAnimation={needAnimation} src={musicImg} alt="Music" />
      )
    );
  }, [playingMusicContent, musicImg, needAnimation, playing]);

  // 获取停止展示
  const getPauseMusicContent = useMemo(() => {
    return pauseMusicContent || <Music src={musicCloseImg} alt="Music" />;
  }, [pauseMusicContent, musicCloseImg]);

  return (
    <Wrapper className={classes.wrapper}>
      <React.Fragment>
        {ready ? (
          <MusicContent className={classes.content} onClick={onClick}>
            {playing ? getPlayingContent : getPauseMusicContent}
          </MusicContent>
        ) : null}
      </React.Fragment>
      <audio
        className={classes.audio}
        {...audioProps}
        id={audioId}
        src={src}
        ref={currentRef}
        autoPlay={false}
        loop={loop}
        preload="auto"
        onEnded={handleEnd}
        onError={onError}
      >
        <p>Your browser doesn't support HTML5 audio. </p>
      </audio>
    </Wrapper>
  );
};

Index.propTypes = {
  src: PropTypes.string.isRequired, // 链接
  currentRef: PropTypes.any.isRequired, // 当前ref
  audioId: PropTypes.string.isRequired, // 音频id 唯一标识！！
  musicImg: PropTypes.string, // 开启音乐时的图片
  musicCloseImg: PropTypes.string, // 关闭音乐时的图片
  onClickMusic: PropTypes.func, // 点击回调
  onMusicEnd: PropTypes.func, // 音乐结束后的回调， 需要loop为false的时候才会生效
  playingMusicContent: PropTypes.any, // 播放中自定义展示
  pauseMusicContent: PropTypes.any, // 暂停中自定义展示
  classes: PropTypes.object, // 复写class
  audioProps: PropTypes.object, // 音频设置
  loop: PropTypes.bool, // 是否循环
  canPlayHandle: PropTypes.func, // 音频可以播放回调
  errorHandle: PropTypes.func, // 错误回调
};

Index.defaultProps = {
  src: 'https://assets.staticimg.com/static/2024-Upbeat-Marketing.mp3',
  audioId: 'kc_audioId',
  musicImg: MusicOpenSvg, // 开启音乐时的图片
  musicCloseImg: MusicCloseSvg, // 关闭音乐时的图片
  onClickMusic: () => {}, // 点击回调
  onMusicEnd: () => {}, // 音乐结束后的回调， 需要loop为false的时候才会生效
  playingMusicContent: null, // 播放中自定义展示
  pauseMusicContent: null, // 暂停中自定义展示
  loop: true, // 是否循环
  audioProps: {}, // 音频设置 参考https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio
  classes: {
    wrapper: '', // 主容器
    content: '', // 内容展示容器
    audio: '', // 音频容器
  },
  needAnimation: false,
};

export default React.memo(Index);
