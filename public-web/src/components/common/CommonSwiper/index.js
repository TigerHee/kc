/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import LazyImg from 'components/common/LazyImg';
import _ from 'lodash';
import React, { useCallback } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import style from './style.less';
import { NextButton, PrevButton } from './SwiperButton';
const noop = () => {};
const Index = (props) => {
  const {
    list = [], // 数据
    className, // 自定义样式
    autoplay = false, // 是否自动播放
    slidesToScroll = 1, // 一次移动几个
    autoplaySpeed = 5000, // 自动切换时间间隔
    speed = 500, // 动画速度
    slidesToShow = 3,
    func, // 自定义子元素生成方法
    handleClick, // 自定义点击方法
    prevClick = noop, // 左按钮点击
    nextClick = noop, // 右按钮点击
    gaType, // 数据上报类型
    beforeChange = noop,
    centerMode = false,
    variableWidth,
    touchMove = true,
    imglazy = false,
    dots = false,
    arrows = true,
  } = props || {};

  const _handleClick = useCallback(
    (item, idx) => {
      if (typeof handleClick === 'function') {
        handleClick(item, idx);
      }
    },
    [handleClick],
  );
  const { isRTL } = useLocale();

  const settings = {
    dots,
    arrows,
    infinite: !!(list && list.length > slidesToShow),
    speed,
    slidesToShow,
    slidesToScroll,
    autoplay,
    autoplaySpeed,
    nextArrow: <NextButton func={nextClick} />,
    prevArrow: <PrevButton func={prevClick} />,
    variableWidth,
    centerMode,
    beforeChange,
    initialSlide: 0,
    touchMove,
    rtl: isRTL,
  };

  return (
    <section className={`${style.commonSwiper} ${className}`}>
      <Slider {...settings}>
        {_.map(list, (item, idx) => {
          return typeof func === 'function' ? (
            func(item, idx, gaType)
          ) : (
            <a
              href={item.url}
              key={idx}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => _handleClick(item, idx)}
              aria-label={`home page swiper ${idx}`}
            >
              {imglazy ? (
                <LazyImg key={idx} src={item.img} preloadSrc={item.preloadImg} alt="" />
              ) : (
                <img src={item.img} className="img" key={idx} alt="" />
              )}
            </a>
          );
        })}
      </Slider>
    </section>
  );
};

export default React.memo(Index);
