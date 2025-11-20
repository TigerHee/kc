/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import classnames from 'clsx';
import { RightOutlined, LeftOutlined } from '@kux/icons';
import useMemoCallback from 'hooks/useMemoCallback';
import useTheme from 'hooks/useTheme';
import { canGoNext } from './aux';
import { Arrow } from './StyledComps';

export const PrevArrow = (props) => {
  const theme = useTheme();
  const clickHandler = useMemoCallback((options) => {
    props.clickHandler?.(options);
  }, []);

  const prevClasses = { 'kux-slick-arrow': true, 'kux-slick-prev': true };
  let prevHandler = () => {
    clickHandler({ message: 'previous' });
  };

  if (!props.infinite && (props.currentSlide === 0 || props.slideCount <= props.slidesToShow)) {
    prevClasses['kux-slick-disabled'] = true;
    prevHandler = null;
  }

  const prevArrowProps = {
    key: '0',
    'data-role': 'prev-button',
    className: classnames(prevClasses),
    onClick: prevHandler,
  };
  const customProps = {
    currentSlide: props.currentSlide,
    slideCount: props.slideCount,
  };
  let prevArrow;

  if (props.prevArrow) {
    prevArrow = (
      <Arrow theme={theme} key="0" type="button" {...prevArrowProps} {...customProps}>
        {props.prevArrow}
      </Arrow>
    );
  } else {
    prevArrow = (
      <Arrow theme={theme} key="0" type="button" {...prevArrowProps}>
        <LeftOutlined size={20} color={theme.colors.textEmphasis} />
      </Arrow>
    );
  }

  return prevArrow;
};

export const NextArrow = (props) => {
  const theme = useTheme();
  const clickHandler = useMemoCallback((options) => {
    props.clickHandler?.(options);
  }, []);

  const nextClasses = { 'kux-slick-arrow': true, 'kux-slick-next': true };

  let nextHandler = () => {
    clickHandler({ message: 'next' });
  };

  if (!canGoNext(props)) {
    nextClasses['kux-slick-disabled'] = true;
    nextHandler = null;
  }

  const nextArrowProps = {
    key: '1',
    'data-role': 'next-button',
    className: classnames(nextClasses),
    onClick: nextHandler,
  };

  const customProps = {
    currentSlide: props.currentSlide,
    slideCount: props.slideCount,
  };
  let nextArrow;
  if (props.nextArrow) {
    nextArrow = (
      <Arrow theme={theme} key="1" type="button" {...nextArrowProps} {...customProps}>
        {props.nextArrow}
      </Arrow>
    );
  } else {
    nextArrow = (
      <Arrow theme={theme} key="1" type="button" {...nextArrowProps}>
        <RightOutlined size={20} color={theme.colors.textEmphasis} />
      </Arrow>
    );
  }

  return nextArrow;
};
