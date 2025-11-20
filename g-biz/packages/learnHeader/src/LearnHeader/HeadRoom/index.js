/**
 * Owner: tom@kupotech.com
 */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import cls from 'clsx';
import { useTheme } from '@kux/mui';
import { ClassNames } from '@emotion/react';
import { getScrollY } from '../../common/tools';
import { CONTAINER_HEIGHT } from '../config';

const useStyles = ({ color, miniMode }) => {
  const height = CONTAINER_HEIGHT[miniMode ? 'mini' : 'common'].max;
  return {
    headerRoomWrapper: `
      height: ${CONTAINER_HEIGHT[miniMode ? 'mini' : 'common'].max}px;
      @media screen and (max-width: 768px) {
        height: ${CONTAINER_HEIGHT[miniMode ? 'mini' : 'common'].min}px;
      }
    `,
    headeroom: `
      height: ${height}px;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      line-height:  ${height}px;
      z-index: 1000;
      background-color: ${color.overlay};
      transition: background-color 0.5s ease;
      @media screen and (max-width: 768px) {
        height: ${CONTAINER_HEIGHT[miniMode ? 'mini' : 'common'].min}px;
        line-height: ${CONTAINER_HEIGHT[miniMode ? 'mini' : 'common'].min}px;
      }
    `,
    transparent: `
      background-color: transparent !important;
    `,
  };
};

const HeadRoom = ({ children, transparent = false, miniMode }) => {
  const listRef = useRef();

  const theme = useTheme();
  const classes = useStyles({ color: theme.colors, miniMode });
  const [opacity, setOpacity] = useState(false); // 默认不透明

  const OPACITY_SCROLL_HEIGHT = 145;

  const transparentMarginBottom = CONTAINER_HEIGHT[miniMode ? 'mini' : 'common'].max;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    _.throttle(() => {
      if (!transparent) {
        setOpacity(false);
      } else if (getScrollY() >= OPACITY_SCROLL_HEIGHT) {
        setOpacity(false);
      } else {
        setOpacity(transparent);
      }
    }, 300),
    [transparent, setOpacity],
  );

  useEffect(() => {
    if (getScrollY() >= OPACITY_SCROLL_HEIGHT) {
      setOpacity(false);
    } else {
      setOpacity(transparent);
    }
  }, [transparent]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <ClassNames>
      {({ css }) => (
        <div
          ref={listRef}
          className={css(classes.headerRoomWrapper)}
          data-class="headerRoomWrapper"
          style={{
            marginBottom: transparent ? `-${transparentMarginBottom}px` : 0,
          }}
        >
          <div
            className={cls(css(classes.headeroom), {
              [css(classes.transparent)]: opacity,
              'gbiz-headeroom': true,
            })}
          >
            {children}
          </div>
        </div>
      )}
    </ClassNames>
  );
};

export default HeadRoom;
