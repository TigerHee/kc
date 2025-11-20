/**
 * Owner: jesse.shao@kupotech.com
 */
//样式组件
import React from 'react';
import { flow, isNil, find, values, slice } from 'lodash/fp';
import classnames from 'classname';
import { preFixNum } from 'helper';
import styles from './styles.less';

const len = 2; //数字前补0

// 生成时间字符对象
export const genTimeObj = time => {
  if (time < 1000) {
    return {
      d: '00',
      h: '00',
      m: '00',
      s: '00',
    };
  }
  let days = Math.floor(time / 1000 / 60 / 60 / 24);
  let hours = Math.floor((time / 1000 / 60 / 60) % 24);
  let minutes = Math.floor((time / 1000 / 60) % 60);
  let seconds = Math.floor((time / 1000) % 60);
  return {
    d: preFixNum(days, len),
    h: preFixNum(hours, len),
    m: preFixNum(minutes, len),
    s: preFixNum(seconds, len),
  };
};

/**
 * 生成时间显示器
 * @param type      string    显示模式,详见返回对象的属性
 * @param timesobj  object    天时分秒显示字符的对象
 * @param suffixobj object    天时分秒后缀的对象
 * @param needZeroGray bool   是否需要倒计时为0时置灰 默认 false
 * @returns {}                生成对应的jsx
 */

export const genTimeBox = (type, classes, timesobj, suffixobj, needZeroGray = false) => {
  const classMap = {
    d: 'day',
    h: 'hour',
    m: 'minute',
    s: 'second',
  };

  const html = type.split('').map((v, i) => {
    const timesobjValues = values(timesobj);
    const validateArray = slice(0, i + 1)(timesobjValues);
    // 需要当前时间单位和前面的时间单位都为 0 才能置灰
    const isEnd = flow(
      find(i => i !== '00' || i > 0),
      isNil,
    )(validateArray);

    return (
      <React.Fragment key={`time-${new Date().valueOf()}-${i}`}>
        {needZeroGray ? (
          <span
            className={classnames(styles[classMap[v]], classes.number, classes[classMap[v]], {
              [classes.zero]: isEnd,
            })}
          >
            {timesobj[v]}
          </span>
        ) : (
          <span className={classnames(styles[classMap[v]], classes.number, classes[classMap[v]])}>
            {timesobj[v]}
          </span>
        )}
        {suffixobj[v + 'suffix'] && (
          <span className={classnames(styles.colon, classes.colon, classes[v + 'colon'])}>
            {suffixobj[v + 'suffix']}
          </span>
        )}
      </React.Fragment>
    );
  });
  return html;
};
