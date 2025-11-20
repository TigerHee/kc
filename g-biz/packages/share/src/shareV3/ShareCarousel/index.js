/*
 * @Owner: alen.su@kupotech.com
 * @Author: alen.su alen.su@kupotech.com
 * @Date: 2023-06-11 15:48:57
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-27 15:29:23
 * @FilePath: /g-biz/packages/share/src/shareV3/ShareCarousel/index.js
 * @Description:
 *
 *
 */

import React, { useRef, useCallback, useState } from 'react';
import Slider from 'react-slick';
import { styled } from '@kufox/mui';
import { goPage } from '../../utils/helper';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Content = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const StyledSlider = styled(Slider)`
  .slick-list {
    .slick-track {
      display: flex;
      align-items: center;
    }
    .slick-slide {
      overflow: hidden;
      border-radius: 16px 16px 0 0;
      .slideImg {
        width: 100%;
        max-height: 130px;
      }
    }
  }
`;

export const ShareCarousel = ({ ads = {} }) => {
  const sliderRef = useRef(null);
  const [curIndex, setCurIndex] = useState(0);

  const adsKey = Object.keys(ads)?.[0];
  const adsList = ads?.[adsKey] || [];

  const SLIDER_SETTING = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const hanndleSliderChange = useCallback((oldIndex, newIndex) => {
    setCurIndex(newIndex);
  }, []);

  const afterSliderChange = useCallback(() => {}, [curIndex]);

  return (
    <Content className="slide-content">
      <StyledSlider
        {...SLIDER_SETTING}
        ref={sliderRef}
        beforeChange={hanndleSliderChange}
        afterChange={afterSliderChange}
      >
        {adsList.map((item) => {
          return (
            <div
              onClick={(e) => {
                e.stopPropagation();
                goPage(item.url);
              }}
            >
              <img className="slideImg" src={item.imageUrl} alt={item?.title} key={item.url} />
            </div>
          );
        })}
      </StyledSlider>
    </Content>
  );
};
