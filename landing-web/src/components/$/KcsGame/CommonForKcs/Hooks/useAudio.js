/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useRef } from 'react';

const wrapEvent = (userEvent, proxyEvent) => {
  return event => {
    try {
      proxyEvent && proxyEvent(event);
    } finally {
      userEvent && userEvent(event);
    }
  };
};

const useAudio = props => {
  const ref = useRef(null);
  const [state, setState] = useState({
    time: 0,
    duration: 0,
    paused: true,
    muted: false,
    volume: 1,
  });

  const onPlay = () => {
    setState(obj => {
      return { ...obj, paused: false };
    });
  };
  const onPause = () => {
    setState(obj => {
      return { ...obj, paused: true };
    });
  };
  const element = React.createElement('audio', {
    ...props,
    ref,
    onPlay: wrapEvent(props.onPlay, onPlay),
    onPause: wrapEvent(props.onPause, onPause),
    onEnded: wrapEvent(props.onEnded, onPause),
  });

  let lockPlay = false;

  const controls = {
    play: () => {
      const el = ref.current;
      if (!el) {
        return undefined;
      }

      if (!lockPlay) {
        const promise = el.play();
        const isPromise = typeof promise === 'object';

        if (isPromise) {
          lockPlay = true;
          const resetLock = () => {
            lockPlay = false;
          };
          promise.then(resetLock, resetLock);
        }

        return promise;
      }
      return undefined;
    },
    pause: () => {
      const el = ref.current;
      if (el && !lockPlay) {
        return el.pause();
      }
    },
    seek: time => {
      const el = ref.current;
      if (!el || state.duration === undefined) {
        return;
      }
      time = Math.min(state.duration, Math.max(0, time));
      el.currentTime = time;
    },
    volume: volume => {
      const el = ref.current;
      if (!el) {
        return;
      }
      volume = Math.min(1, Math.max(0, volume));
      el.volume = volume;
      setState(obj => {
        return { ...obj, volume };
      });
    },
    mute: () => {
      const el = ref.current;
      if (!el) {
        return;
      }
      el.muted = true;
    },
    unmute: () => {
      const el = ref.current;
      if (!el) {
        return;
      }
      el.muted = false;
    },
  };

  return [
    <span>
      {element}
      {/* {state.paused ? (
        <button onClick={controls.play}>点击播放</button>
      ) : (
        <button onClick={controls.pause}>点击暂停</button>
      )} */}
    </span>,
    controls,
    ref,
  ];
};
export default useAudio;
