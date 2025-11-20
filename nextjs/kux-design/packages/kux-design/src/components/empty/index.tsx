/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description StatusIcon component
 */
import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { useIsDark } from '@/hooks'
import { clx, isRenderable } from '@/common'
import type { IBasicSize, ISizeAuto, ITheme, IThemeAuto } from '@/shared-type'
import { LottiePlayer } from '../lottie-player'

import errorIcon from './assets/error.json?url'
import errorDarkIcon from './assets/error-dark.json?url'
import warnIcon from './assets/caveat.json?url'
import warnDarkIcon from './assets/caveat-dark.json?url'
import waitIcon from './assets/wait.json?url'
import waitDarkIcon from './assets/wait-dark.json?url'
import safetyIcon from './assets/safety.json?url'
import safetyDarkIcon from './assets/safety-dark.json?url'
import successIcon from './assets/success.json?url'
import successDarkIcon from './assets/success-dark.json?url'
import promptIcon from './assets/prompt.json?url'
import promptDarkIcon from './assets/prompt-dark.json?url'
import noRecordIcon from './assets/no-records.json?url'
import noRecordDarkIcon from './assets/no-records-dark.json?url'
import suspensionTradingIcon from './assets/suspension-trading.json?url'
import suspensionTradingDarkIcon from './assets/suspension-trading-dark.json?url'
import networkErrorIcon from './assets/network-error.json?url'
import networkErrorDarkIcon from './assets/network-error-dark.json?url'
import systemBusyIcon from './assets/system-busy.json?url'
import systemBusyDarkIcon from './assets/system-busy-dark.json?url'


import './style.scss'

export const STATUS_ICON_MAP = {
  warn: {
    light: warnIcon,
    dark: warnDarkIcon,
  },
  error: {
    light: errorIcon,
    dark: errorDarkIcon,
  },
  wait: {
    light: waitIcon,
    dark: waitDarkIcon,
  },
  safety: {
    light: safetyIcon,
    dark: safetyDarkIcon,
    options: {
      // 需要分段播放, 0-50fps（播放一次）；50fps-195fps（无限循环）
      segment: true, 
    }
  },
  success: {
    light: successIcon,
    dark: successDarkIcon,
    options: {
      // 需要分段播放, 0-50fps（播放一次）；50fps-195fps（无限循环）
      segment: true, 
    }
  },
  prompt: {
    light: promptIcon,
    dark: promptDarkIcon,
  },
  'no-record': {
    light: noRecordIcon,
    dark: noRecordDarkIcon,
  },
  'suspension-trading': {
    light: suspensionTradingIcon,
    dark: suspensionTradingDarkIcon,
    options: {
      // 不循环, 只播放一次
      loop: false,
    }
  },
  'network-error': {
    light: networkErrorIcon,
    dark: networkErrorDarkIcon,
  },
  'system-busy': {
    light: systemBusyIcon,
    dark: systemBusyDarkIcon,
  },
} as const;

export interface IEmptyProps {
  /**
   * 是否立即渲染动画, 为 false 则会等到页面 LCP 就绪后再渲染动画, 默认 false
   */
  immediate?: boolean;
  /**
   * 图标名称
   */
  name: keyof typeof STATUS_ICON_MAP;
  /**
   * 主题模式, 默认 'auto'
   */
  theme?: ITheme | IThemeAuto;

  /**
   * 组件尺寸
   * * small: 小尺寸
   * * medium: 中等尺寸
   * * auto: 自适应尺寸(默认)
   */
  size?: IBasicSize | ISizeAuto;
  /**
   * 状态标题
   * @default false
   */
  title?: ReactNode;

  /**
   * 状态描述
   * @default false
   */
  description?: ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: CSSProperties;
}

/**
 * StatusIcon component
 */
export function Empty(props: IEmptyProps) {
  const isDark = useIsDark();
  const [jsonPath, options] = useMemo(() => {
    const icons = STATUS_ICON_MAP[props.name];
    if (!icons) return ['', {}];
    if (props.theme && props.theme !== 'auto') {
      // @ts-expect-error ignore
      return [icons[props.theme] || icons.light, icons.options || {}];
    }
    // @ts-expect-error ignore
    return [icons[isDark ? 'dark' : 'light'], icons.options || {}];
  }, [props.theme, isDark, props.name]);

  const onReady = (animation: any) => {
    // 如果是分段播放的动画, 则需要在动画加载完成后开始
    if (!options.segment || !animation) return;
    // 播放 0–50 帧，完成后再循环播放 50–195
    animation.playSegments([0, 50], true);

    animation.addEventListener('complete', () => {
      // 播放完成后再循环播放 50–195 帧
      animation.removeEventListener('complete'); // 防止重复绑定
      animation.playSegments([50, 195], true);
      animation.loop = true;
    });
  }

  const loop = options.loop !== false && !options.segment;
  const autoplay = !options.segment;

  const hasTitle = isRenderable(props.title);
  const hasDescription = isRenderable(props.description);
  // 仅当 title 与 description 都存在时才渲染为 title
  const title = hasTitle && hasDescription ? props.title : undefined;
  // 标题和描述都存在时才使用 description 当作描述渲染, 其他清空优先将 title 当作描述使用
  const description = hasTitle && hasDescription
    ? props.description : (hasTitle && props.title) || (hasDescription && props.description);
  return (
    <div className={clx('kux-empty', `is-${props.size || 'auto'}`, props.className)}>
      <LottiePlayer
        immediate={props.immediate}
        className='kux-empty-icon'
        path={jsonPath}
        onReady={onReady}
        loop={loop}
        autoplay={autoplay}
        style={props.style}
      />
      {/* 仅当 title 和 description 都存在时才渲染 */}
      {(hasTitle || hasDescription) && (
        <>
          
          {title && (
            <div className='kux-empty-title'>
              {title}
            </div>
          )}
          {/* 仅当 description 存在时才渲染 */}
          {description && (
            <div className='kux-empty-description'>
              {description}
            </div>
          )}
        </>
      )}
    </div>
  )
}
