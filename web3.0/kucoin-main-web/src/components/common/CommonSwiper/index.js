/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NextButton, PrevButton } from './SwiperButton';
import _ from 'lodash';
import { addLangToPath } from 'tools/i18n';
import style from './style.less';

const Index = (props) => {
  const {
    list = [], // 数据
    className, // 自定义样式
    autoplay = true, // 是否自动播放
    slidesToScroll = 1, // 一次移动几个
    autoplaySpeed = 5000, // 自动切换时间间隔
    speed = 500, // 动画速度
    slidesToShow = 3,
    func, // 自定义子元素生成方法
    handleClick, // 自定义点击方法
    gaType, // 数据上报类型
    next, // 下一步按钮
    prev, // 上一步按钮
  } = props || {};

  const _handleClick = useCallback(
    (item, idx) => {
      if (typeof handleClick === 'function') {
        handleClick(item, idx);
      }
    },
    [handleClick],
  );

  const settings = {
    dots: false,
    infinite: !!(list && list.length > 3),
    speed,
    slidesToShow,
    slidesToScroll,
    autoplay,
    autoplaySpeed,
    nextArrow: next || <NextButton />,
    prevArrow: prev || <PrevButton />,
    variableWidth: true,
  };

  return (
    <section className={`${style.commonSwiper} wow fadeInUp ${className}`}>
      <Slider {...settings}>
        {_.map(list, (item, idx) => {
          return typeof func === 'function' ? (
            func(item, idx, gaType)
          ) : (
            <a
              href={addLangToPath(item.url)}
              key={idx}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => _handleClick(item, idx)}
            >
              <img src={item.img} className="img" key={idx} alt="" />
            </a>
          );
        })}
      </Slider>
    </section>
  );
};

export default Index;
