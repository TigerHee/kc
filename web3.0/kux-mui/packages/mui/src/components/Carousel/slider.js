/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { InnerSlider } from './inner-slider';
import defaultProps from './default-props';
import { SlickSide } from './StyledComps';

export default class Slider extends React.Component {
  innerSliderRefHandler = (ref) => {
    this.innerSlider = ref;
  };

  slickPrev = () => this.innerSlider.slickPrev();

  slickNext = () => this.innerSlider.slickNext();

  slickGoTo = (slide, dontAnimate = false) => this.innerSlider.slickGoTo(slide, dontAnimate);

  slickPause = () => this.innerSlider.pause('paused');

  slickPlay = () => this.innerSlider.autoPlay('play');

  render() {
    const settings = { ...defaultProps, ...this.props };

    if (settings.centerMode) {
      if (settings.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToScroll should be equal to 1 in centerMode, you are using ${settings.slidesToScroll}`,
        );
      }
      settings.slidesToScroll = 1;
    }

    if (settings.fade) {
      if (settings.slidesToShow > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToShow should be equal to 1 when fade is true, you're using ${settings.slidesToShow}`,
        );
      }
      if (settings.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToScroll should be equal to 1 when fade is true, you're using ${settings.slidesToScroll}`,
        );
      }
      settings.slidesToShow = 1;
      settings.slidesToScroll = 1;
    }

    let children = React.Children.toArray(this.props.children);

    children = children.filter((child) => {
      if (typeof child === 'string') {
        return !!child.trim();
      }
      return !!child;
    });

    if (settings.variableWidth && (settings.rows > 1 || settings.slidesPerRow > 1)) {
      console.warn(`variableWidth is not supported in case of rows > 1 or slidesPerRow > 1`);
      settings.variableWidth = false;
    }
    const newChildren = [];
    let currentWidth = null;

    for (let i = 0; i < children.length; i += settings.rows * settings.slidesPerRow) {
      const newSlide = [];
      for (let j = i; j < i + settings.rows * settings.slidesPerRow; j += settings.slidesPerRow) {
        const row = [];
        for (let k = j; k < j + settings.slidesPerRow; k += 1) {
          if (settings.variableWidth && children[k].props.style) {
            currentWidth = children[k].props.style.width;
          }
          if (k >= children.length) break;

          row.push(
            React.cloneElement(children[k], {
              key: 100 * i + 10 * j + k,
              tabIndex: -1,
              style: {
                width: `${100 / settings.slidesPerRow}%`,
                display: 'inline-block',
                ...(children[k]?.props?.style || {}),
              },
            }),
          );
        }
        newSlide.push(<div key={10 * i + j}>{row}</div>);
      }
      if (settings.variableWidth) {
        newChildren.push(
          <SlickSide
            vertical={this.props.vertical}
            data-role="slide"
            key={i}
            style={{ width: currentWidth }}
          >
            {newSlide}
          </SlickSide>,
        );
      } else {
        newChildren.push(
          <SlickSide vertical={this.props.vertical} data-role="slide" key={i}>
            {newSlide}
          </SlickSide>,
        );
      }
    }

    if (settings === 'unslick') {
      const className = `regular slider ${this.props.className || ''}`;
      return <div className={className}>{children}</div>;
    }
    if (newChildren.length <= settings.slidesToShow) {
      settings.unslick = true;
    }
    return (
      <InnerSlider style={this.props.style} ref={this.innerSliderRefHandler} {...settings}>
        {newChildren}
      </InnerSlider>
    );
  }
}
