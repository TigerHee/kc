/**
 * Owner: jennifer.y.liu@kupotech.com
 */
import React from 'react';
import { useLocale } from '@kucoin-base/i18n';
import { styled, numberFormat }  from '@kux/mui';
import PercenterTop from 'static/spotlight7/percent.svg';
import clsx from 'clsx';
/**
 * 通用图标包装
 * @param {string} props.icon 图标地址
 * @param {string} props.size 图标尺寸, 默认 20px
 * @param {string} props.width 图标宽, 默认 20px
 * @param {string} props.height 图标高, 默认 20px
 */

const ProgressWrapper = styled.div`
  position: relative;
  height: 10px;
  background-color: rgba(128, 241, 87, 0.16);
  border-radius: 15px;
  width: 100%;
  .icon {
    position: absolute;
    top: -7px;
    right: -13px;
  }
  --progress: ${(props) => props.progress}%;
  .progress-growth-animate {
    animation: progress-growth 1s ${(props) => props.delay || '1.2s'} cubic-bezier(0.16, 0, 0.18, 1)
      forwards;
    @keyframes progress-growth {
      0% {
        width: 0%;
      }
      100% {
        width: var(--progress);
      }
    }
  }
`;

const ProgressInner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  background-image: linear-gradient(
    -60deg,
    rgba(29, 29 ,29, 0.2) 0%,
    transparent 0%,
    transparent 40%,
    rgba(29, 29 ,29, 0.2) 40%,
    rgba(29, 29 ,29, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1em 1em;
  height: 100%;
  border-radius: 80px;
  animation: ${(props) =>
    props.animate
      ? `
    progress-bar-stripes 2s linear infinite,
    progress-growth 1s ${props.delay || '1.2s'} cubic-bezier(0.16, 0, 0.18, 1) forwards
  `
      : 'progress-bar-stripes 2s linear infinite'};
  @keyframes progress-bar-stripes {
    from {
      background-position: 0 0;
    }
    to {
      background-position: ${() =>
          document.documentElement.getAttribute('dir') === 'rtl' ? -2 : 2}em
        0;
    }
  }
`;

const ProgressGradient = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(90deg, #AAFF8D 0%, #7FFCA7 100%);
  /* background: #736d6d; */
  height: 100%;
  border-radius: 14px;
`;
const PercentNum = styled.div`
  display: flex;
  padding: 0px 4px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  color: var(--0-Button-Text-Primary-Button-Text, #1D1D1D);
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 15.6px */
  border-radius: 8px;
  background: var(--12-illustration-illustration-Green, #D3F475);
  position: absolute;
  --progress: ${(props) => props.progress}%;
  left: ${(props) => props.progress === 100? `calc(100% - 32px)`: `${props.progress - 2}%`};

  position: absolute;
  top: 16px;
  &::before {
    position: absolute;
    left: ${(props) => props.progress === 100? `25px`: `5px`};
    display: block;
    width: 8px;
    height: 100%;
    background: url(${PercenterTop}) no-repeat;
    background-size: contain;
    content: '';
    top: -3px;
  }
`;
/**
 * 进度条
 * @param {*} props
 * @param {object} props.style 外层wrapper样式
 * @param {object} props.gradientStyle 渐变条样式
 * @param {boolean} props.animate 是否显示动画
 * @param {number} props.progress 0~100
 * @param {boolean} props.hideCoin 是否隐藏USDT符号
 * @param {React.ReactNode} props.icon 自定义图标
 * @param {React.ReactNode} props.iconTitle 自定义图标label
 * 
 */
const ProgressLine = (props) => {
  const { currentLang } = useLocale();

  const gradientStyle = Object.assign(
    {
      width: `${props.animate ? 0 : props.progress}%`,
    },
    props.gradientStyle,
  );

  return (
    <ProgressWrapper
      className={props.className || ''}
      style={props.style}
      progress={props.progress}
      delay={props.delay}
      data-testid="progress-wrapper"
    >
      <ProgressGradient
        data-testid="progress-gradient"
        style={gradientStyle}
        className={clsx({
          'progress-growth-animate': props.animate,
        })}
      />
      <ProgressInner
        style={{ width: `${props.animate ? 0 : props.progress}%` }}
        animate={props.animate}
        delay={props.delay}
        onAnimationEnd={props.onAnimationEnd}
        data-testid="progress-inner"
      />
      <PercentNum data-testid="percent-num" progress={props.progress}>
        {props.iconTitle }
      </PercentNum>
    </ProgressWrapper>
  );
}
export default ProgressLine;
