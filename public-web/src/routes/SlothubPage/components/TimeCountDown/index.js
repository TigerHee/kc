/*
 * @Date: 2024-05-28 11:20:38
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */

import { css, cx } from '@emotion/css';
import { useLocale } from '@kucoin-base/i18n';
import { useCountDown } from 'ahooks';
import React, { useMemo } from 'react';
import { isChrome } from 'src/utils/judgeChrome';
import timeIntervalIconLight from 'static/slothub/time-interval-light.svg';
import timeIntervalIcon from 'static/slothub/time-interval.svg';
import { TimeDisplay, TimeIntervalImg, TimeNumber } from './styled';
import { convertSecondsToDHMS, padZero } from './util';

export const timeCountDownThemeType = {
  light: 'light',
  dark: 'dark',
};

export const intervalColorThemeType = {
  light: 'light', //  rgba(243, 243, 243, 0.60);
  dark: 'dark', // rgba(29, 29, 29, 0.60)
};

export const timeCountDownSizeType = {
  basic: 'basic',
  small: 'small',
};

const SIZE_STYLE_CLASS_MAP = {
  [timeCountDownSizeType.basic]: {
    getCss: () => css`
      font-size: 12px;
      font-weight: 600;
      //old
      //padding: 1.75px 1.2px;
      //box-sizing: border-box;
      padding: 2px 1px;
      box-sizing: content-box;
    `,
  },
  [timeCountDownSizeType.small]: {
    getCss: () => {
      return css`
        font-size: ${isChrome ? '12px' : '9px'};
        font-weight: 500;
        height: ${isChrome ? '12px' : '8px'};
        box-sizing: content-box;
        zoom: ${isChrome ? 0.75 : 'unset'};
        display: block;
        line-height: ${isChrome ? '100%' : '8px'};
        padding: ${isChrome ? '1.7px 1.5px' : '2px 1px'};
      `;
    },
  },
};

/**
 * TimeCountDown 天 时 分 秒 倒计时
 * @param {Object} props - Component props
 * @param {string} props.className
 * @param {number} props.value - 目标时间 (毫秒时间戳)
 * @param {Function} props.onEnd - 倒计时结束 （为 0）回调
 * @param {('light'|'dark')} [props.colorTheme=timeCountDownThemeType.light] -  倒计时显示的主题类型
 * @param {('basic'|'small')} [props.size=timeCountDownSizeType.basic] - 倒计时显示的大小
 * @param {Object} props.intervalThemeConfig - 倒计时间隔冒号主题配置
 * @param {number} [props.intervalThemeConfig.gapWidth=true] - 冒号间隔 默认2px
 * @param {('light'|'dark')} [props.intervalThemeConfig.colorTheme=intervalColorThemeType.dark] - 冒号颜色 默认黑色
 * @param {Object} props.config - 配置选项对象
 * @param {boolean} [props.config.needDays=true] - 是否显示天数
 * @param {boolean} [props.config.needHours=true] - 是否显示小时数
 * @param {boolean} [props.isStaticValue=false] - 是否静态展示（新人引导固定值场景）
 *
 * @param {Object} otherProps
 */
const TimeCountDown = ({
  className,
  value,
  colorTheme = timeCountDownThemeType.light,
  intervalThemeConfig = {
    gapWidth: 2, // 间隔宽度
    colorTheme: intervalColorThemeType.dark,
  },
  size = timeCountDownSizeType.basic,
  config = { needDays: true, needHours: true },
  onEnd,
  isStaticValue = false,
  ...otherProps
}) => {
  const { isRTL } = useLocale();
  const isLightTheme = timeCountDownThemeType.light === colorTheme;
  const sizeClass = SIZE_STYLE_CLASS_MAP[size] || SIZE_STYLE_CLASS_MAP.basic;
  const { gapWidth, colorTheme: intervalColorTheme } = intervalThemeConfig;
  const [countdown] = useCountDown({
    targetDate: value,
    onEnd,
  });

  const countDownList = useMemo(() => {
    if (isStaticValue && Array.isArray(value)) {
      return value.map((i) => padZero(i));
    }

    return convertSecondsToDHMS(countdown, config);
  }, [config, countdown, isStaticValue, value]);

  return (
    <TimeDisplay isRTL={isRTL} className={className} {...otherProps}>
      {countDownList.map((number, idx) => (
        <React.Fragment key={`count_down_item_${idx}`}>
          {idx !== 0 && (
            <TimeIntervalImg
              gapWidth={gapWidth}
              src={
                intervalColorTheme === intervalColorThemeType.light
                  ? timeIntervalIconLight
                  : timeIntervalIcon
              }
              alt="time-interval"
            />
          )}
          <TimeNumber isDark={!isLightTheme} className={cx(sizeClass.getCss(), 'tag-item')}>
            {number}
          </TimeNumber>
        </React.Fragment>
      ))}
    </TimeDisplay>
  );
};

export default TimeCountDown;
