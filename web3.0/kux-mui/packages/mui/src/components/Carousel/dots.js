/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import classnames from 'clsx';
import useMemoCallback from 'hooks/useMemoCallback';
import useTheme from 'hooks/useTheme';
import { clamp } from './aux';
import { DotsItem } from './StyledComps';

const getDotCount = (spec) => {
  let dots;

  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots = Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) + 1;
  }

  return dots;
};

export const Dots = (props) => {
  const theme = useTheme();
  const clickHandler = useMemoCallback((options) => {
    props.clickHandler?.(options);
  });
  const {
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    infinite,
    slidesToScroll,
    slidesToShow,
    slideCount,
    currentSlide,
  } = props;
  const dotCount = getDotCount({
    slideCount,
    slidesToScroll,
    slidesToShow,
    infinite,
  });

  const mouseEvents = { onMouseEnter, onMouseOver, onMouseLeave };
  let dots = [];
  for (let i = 0; i < dotCount; i++) {
    const _rightBound = (i + 1) * slidesToScroll - 1;
    const rightBound = infinite ? _rightBound : clamp(_rightBound, 0, slideCount - 1);
    const _leftBound = rightBound - (slidesToScroll - 1);
    const leftBound = infinite ? _leftBound : clamp(_leftBound, 0, slideCount - 1);

    const isActive = infinite
      ? currentSlide >= leftBound && currentSlide <= rightBound
      : currentSlide === leftBound;
    const className = classnames({
      'kux-slick-active': isActive,
      'kux-slick-item': true,
    });

    const dotOptions = {
      message: 'dots',
      index: i,
      slidesToScroll,
      currentSlide,
    };

    const onClick = () => {
      clickHandler(dotOptions);
    };

    if (props.customPaging) {
      dots = dots.concat(
        React.cloneElement(props.customPaging?.(i, isActive), { onClick, className }),
      );
    } else {
      dots = dots.concat(
        <DotsItem
          theme={theme}
          onClick={onClick}
          isActive={isActive}
          key={i}
          className={className}
        />,
      );
    }
  }

  return React.cloneElement(props.appendDots?.(dots), {
    className: props.dotsClass,
    ...mouseEvents,
  });
};
