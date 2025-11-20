/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import classnames from 'clsx';
import { lazyStartIndex, lazyEndIndex, getPreClones } from './aux';
import { SlickTrack, SlickSide } from './StyledComps';

const getSlideClasses = (spec) => {
  let slickActive;
  let slickCenter;
  let centerOffset;
  let index;

  if (spec.rtl) {
    index = spec.slideCount - 1 - spec.index;
  } else {
    index = spec.index;
  }
  const slickCloned = index < 0 || index >= spec.slideCount;
  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = (index - spec.currentSlide) % spec.slideCount === 0;
    if (index > spec.currentSlide - centerOffset - 1 && index <= spec.currentSlide + centerOffset) {
      slickActive = true;
    }
  } else {
    slickActive = spec.currentSlide <= index && index < spec.currentSlide + spec.slidesToShow;
  }

  let focusedSlide;
  if (spec.targetSlide < 0) {
    focusedSlide = spec.targetSlide + spec.slideCount;
  } else if (spec.targetSlide >= spec.slideCount) {
    focusedSlide = spec.targetSlide - spec.slideCount;
  } else {
    focusedSlide = spec.targetSlide;
  }
  const slickCurrent = index === focusedSlide;
  return {
    'kux-slick-slide': true,
    'kux-slick-active': slickActive,
    'kux-slick-center': slickCenter,
    'kux-slick-cloned': slickCloned,
    'kux-slick-current': slickCurrent,
  };
};

const getSlideStyle = (spec) => {
  const style = {};

  if (spec.variableWidth === undefined || spec.variableWidth === false) {
    style.width = spec.slideWidth;
  }

  if (spec.fade) {
    style.position = 'relative';
    if (spec.vertical) {
      style.top = -spec.index * parseInt(spec.slideHeight);
    } else {
      style.left = -spec.index * parseInt(spec.slideWidth);
    }
    style.opacity = spec.currentSlide === spec.index ? 1 : 0;
    if (spec.useCSS) {
      style.transition = `opacity ${spec.speed}ms ${spec.cssEase}, visibility ${spec.speed}ms ${spec.cssEase}`;
    }
  }

  return style;
};

const getKey = (child, fallbackKey) => child.key || fallbackKey;

const renderSlides = (spec) => {
  let key;
  const slides = [];
  const preCloneSlides = [];
  const postCloneSlides = [];
  const childrenCount = React.Children.count(spec.children);
  const startIndex = lazyStartIndex(spec);
  const endIndex = lazyEndIndex(spec);

  React.Children.forEach(spec.children, (elem, index) => {
    let child;
    const childOnClickOptions = {
      message: 'children',
      index,
      slidesToScroll: spec.slidesToScroll,
      currentSlide: spec.currentSlide,
    };

    if (!spec.lazyLoad || (spec.lazyLoad && spec.lazyLoadedList.indexOf(index) >= 0)) {
      child = elem;
    } else {
      child = <SlickSide />;
    }
    const childStyle = getSlideStyle({ ...spec, index });
    const slideClass = child.props.className || '';
    let slideClasses = getSlideClasses({ ...spec, index });

    slides.push(
      React.cloneElement(child, {
        key: `original${getKey(child, index)}`,
        'data-index': index,
        className: classnames(slideClasses, slideClass),
        tabIndex: '-1',
        'aria-hidden': !slideClasses['kux-slick-active'],
        style: { outline: 'none', ...childStyle },
        onClick: (e) => {
          child.props && child.props.onClick && child.props.onClick(e);
          if (spec.focusOnSelect) {
            spec.focusOnSelect(childOnClickOptions);
          }
        },
      }),
    );

    if (spec.infinite && spec.fade === false) {
      const preCloneNo = childrenCount - index;
      if (preCloneNo <= getPreClones(spec) && childrenCount !== spec.slidesToShow) {
        key = -preCloneNo;
        if (key >= startIndex) {
          child = elem;
        }
        slideClasses = getSlideClasses({ ...spec, index: key });
        preCloneSlides.push(
          React.cloneElement(child, {
            key: `precloned${getKey(child, key)}`,
            'data-index': key,
            tabIndex: '-1',
            className: classnames(slideClasses, slideClass),
            'aria-hidden': !slideClasses['kux-slick-active'],
            style: { ...childStyle },
            onClick: (e) => {
              child.props && child.props.onClick && child.props.onClick(e);
              if (spec.focusOnSelect) {
                spec.focusOnSelect(childOnClickOptions);
              }
            },
          }),
        );
      }

      if (childrenCount !== spec.slidesToShow) {
        key = childrenCount + index;
        if (key < endIndex) {
          child = elem;
        }
        slideClasses = getSlideClasses({ ...spec, index: key });
        postCloneSlides.push(
          React.cloneElement(child, {
            key: `postcloned${getKey(child, key)}`,
            'data-index': key,
            tabIndex: '-1',
            className: classnames(slideClasses, slideClass),
            'aria-hidden': !slideClasses['slick-active'],
            style: { ...childStyle },
            onClick: (e) => {
              child.props && child.props.onClick && child.props.onClick(e);
              if (spec.focusOnSelect) {
                spec.focusOnSelect(childOnClickOptions);
              }
            },
          }),
        );
      }
    }
  });

  if (spec.rtl) {
    return preCloneSlides.concat(slides, postCloneSlides).reverse();
  }

  return preCloneSlides.concat(slides, postCloneSlides);
};

export class Track extends React.PureComponent {
  node = null;

  handleRef = (ref) => {
    this.node = ref;
  };

  render() {
    const slides = renderSlides(this.props);
    const { onMouseEnter, onMouseOver, onMouseLeave } = this.props;
    const mouseEvents = { onMouseEnter, onMouseOver, onMouseLeave };
    return (
      <SlickTrack
        ref={this.handleRef}
        className="kux-slick-track"
        style={this.props.trackStyle}
        {...mouseEvents}
      >
        {slides}
      </SlickTrack>
    );
  }
}
