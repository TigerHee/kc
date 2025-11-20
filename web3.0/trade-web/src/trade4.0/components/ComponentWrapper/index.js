/**
 * Owner: borden@kupotech.com
 */
import React, { memo, useState, useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { debounce } from 'lodash';
import classnames from 'classnames';
import { event } from '@/utils/event';
import * as AllWrapperContext from './context';
import { defaultBreakPoints, breakPointMatch } from './constant';
import { Wrapper } from './style';

let resizeObserver;

/**
 * @description 组件容器,根据容器进行自适应
 * @param {boolean} props.isCustomKey 是否使用自定义key，
 * 为true时，将根据传递的断点返回,
 * example:
 * breakPoints:[400, 600, 800, 1000],
 * 容器宽度满足(0, 400),screen: "400",
 * 容器宽度满足[400, 600),screen: "400-600"
 * 容器宽度满足[600, 800), screen: "600-800"
 * 容器宽度满足[800, 1000), screen: "800-1000"
 * 容器宽度满足[1000, max), screen: "1000"
 * 为false（默认值）时,
 * 容器宽度满足(0, 400),screen: "sm",
 * 容器宽度满足[400, 600),screen: "md"
 * 容器宽度满足[600, 800), screen: "lg"
 * 容器宽度满足[800, 1000), screen: "lg1"（自增模式了）
 * 容器宽度满足[1000, max), screen: "lg2"（自增模式了）
 * @default props.isCustomKey false
 */
const ComponentWrapper = memo(
  ({
    name,
    context,
    children,
    className,
    delay = 100,
    isCustomKey = false,
    breakPoints = defaultBreakPoints,
    'data-inspector': dataInspector, // 过滤该属性的传入，使其成为内部属性
    ...others
  }) => {
    const ref = useRef();
    const [screen, setScreen] = useState('');
    // 如果传了context，则会使用传入的context，否则会使用通用wrapper
    const WrapperContext = context || AllWrapperContext[name];
    const eventName = `screen_${name}_change`;
    const hasScreen = !!screen;

    // 监听wrapper变化
    useEffect(() => {
      if (ref.current && breakPoints.length > 0) {
        const fx = debounce((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            // 这里需要多便利一次
            for (let i = 0; i < breakPoints.length + 1; i++) {
              const _screen = breakPointMatch({
                // 取上一个
                min: breakPoints[i - 1],
                // 取当前
                max: breakPoints[i],
                // 当前宽度
                v: width,
                // 索引
                index: i,
                // 是否自定义key
                isCustomKey,
              });
              if (_screen) {
                event.emit(eventName, { _screen, width, height });
                return setScreen(_screen);
              }
            }
          }
        }, delay);
        resizeObserver = new ResizeObserver((entries) => {
          fx(entries);
        });
        resizeObserver.observe(ref.current);
      }
      return () => {
        if (ref.current) {
          resizeObserver.unobserve(ref.current);
        }
      };
    }, [ref, hasScreen, breakPoints, eventName, delay, isCustomKey]);

    return (
      <WrapperContext.Provider value={screen}>
        <Wrapper
          data-inspector={`tradeV4_${name}`}
          className={classnames(screen, className)}
          ref={ref}
          {...others}
        >
          {screen && children}
        </Wrapper>
      </WrapperContext.Provider>
    );
  },
);

export default ComponentWrapper;
