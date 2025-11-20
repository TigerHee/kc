/*
 * @owner: borden@kupotech.com
 * @desc: y轴取响应式断点
 */
import React, { useState, useEffect, useContext, createContext, forwardRef } from 'react';
import { debounce } from 'lodash';
import { event } from '@/utils/event';
import { breakPointMatch } from './constant';

class AxisYScreen {
  group = {};

  getScreen(name, breakPoints, isCustomKey) {
    if (this.group[name]) {
      return this.group[name];
    }
    const YScreenContext = createContext('');
    this.group[name] = {
      // Context
      YScreenContext,
      // Provider
      YScreenWrapper: ({ children }) => {
        const [value, setValue] = useState('');
        const eventName = name ? `screen_${name}_change` : '';

        useEffect(() => {
          if (eventName && breakPoints.length > 0) {
            event.on(eventName, debounce(({ height }) => {
              for (let i = 0; i < breakPoints.length + 1; i++) {
                const nextValue = breakPointMatch({
                  min: breakPoints[i - 1],
                  max: breakPoints[i],
                  v: height,
                  index: i,
                  isCustomKey,
                });
                if (nextValue) {
                  // console.log(`///////y-screen change`, height, nextValue);
                  return setValue(nextValue);
                }
              }
            }, 200));
          }
          return () => {
            if (eventName && breakPoints.length > 0) {
              event.off(eventName);
            }
          };
        }, [eventName, breakPoints, isCustomKey]);

        return (
          <YScreenContext.Provider value={value}>
            {value && children}
          </YScreenContext.Provider>
        );
      },
      // Hook
      useYScreen: () => {
        const yScreen = useContext(YScreenContext);
        return yScreen;
      },
      // HOC
      withYScreen: (FC) => {
        return forwardRef(({ children, ...others }, ref) => {
          const yScreen = useContext(YScreenContext);
          const $useCss = (screens) => (cssStr) => {
            if (
              yScreen &&
              (yScreen === screens || screens?.includes(yScreen))
            ) {
              return cssStr;
            }
          };
          return (
            <FC
              ref={ref}
              $useCss={$useCss}
              {...others}
            >
              {children}
            </FC>
          );
        });
      },
    };
    return this.group[name];
  }
}

const axisYScreen = new AxisYScreen();

export default axisYScreen;

