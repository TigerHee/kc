/* eslint-disable no-unused-expressions */
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
      const div = document.createElement('div');
      div.className = className;
      document?.body?.appendChild(div);

      const props = {
        onStop: () => {
          document?.body?.removeChild(div);
        },
        ...config,
      };
      const element = React.createElement(Beep, props);

      ReactDOM.render(element, div);
    };
  }
  return () => {};
})(document);
