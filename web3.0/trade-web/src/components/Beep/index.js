/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2019-05-21 14:21:04
 * @LastEditTime: 2019-06-05 19:07:27
 * @Description: 新增提示音, src必传
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Beep from './Beep';

const className = '.kc-voice-tips';
const isBrowser = !!(typeof window !== 'undefined' && window);

export default ((document) => {
  if (isBrowser && document.createElement('audio').canPlayType) {
    return (config = {}) => {
      if (!config.src) return;
      // 如果此时存在其他提示音，干掉
      const playingVoice = document.getElementsByClassName(className);
      const len = playingVoice.length;
      if (len) {
        for (let i = 0; i < len; i++) {
          document.body.removeChild(playingVoice[i]);
        }
      }

      const div = document.createElement('div');
      div.className = className;
      document.body.appendChild(div);

      const props = {
        onStop: () => {
          document.body.removeChild(div);
        },
        ...config,
      };
      const element = React.createElement(Beep, props);

      ReactDOM.render(element, div);
    };
  }
  return () => {};
})(document);
