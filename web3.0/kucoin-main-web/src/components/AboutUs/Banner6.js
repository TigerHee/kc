/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';
import { _t } from 'src/tools/i18n';
import Pointer from './Pointer';
import CircleImg from 'static/about-us/banner6_circle.svg';
import Icon1 from 'static/about-us/banner6_1.png';
import IconActive1 from 'static/about-us/banner6_1_a.png';
import Icon2 from 'static/about-us/banner6_2.png';
import IconActive2 from 'static/about-us/banner6_2_a.png';
import Icon3 from 'static/about-us/banner6_3.png';
import IconActive3 from 'static/about-us/banner6_3_a.png';
import Icon4 from 'static/about-us/banner6_4.png';
import IconActive4 from 'static/about-us/banner6_4_a.png';
import Icon5 from 'static/about-us/banner6_5.png';
import IconActive5 from 'static/about-us/banner6_5_a.png';
import Icon6 from 'static/about-us/banner6_6.png';
import IconActive6 from 'static/about-us/banner6_6_a.png';
import Icon7 from 'static/about-us/banner6_7.png';
import IconActive7 from 'static/about-us/banner6_7_a.png';
import Icon8 from 'static/about-us/banner6_8.png';
import IconActive8 from 'static/about-us/banner6_8_a.png';
import Icon9 from 'static/about-us/banner6_9.png';
import IconActive9 from 'static/about-us/banner6_9_a.png';
import Icon10 from 'static/about-us/banner6_10.png';
import IconActive10 from 'static/about-us/banner6_10_a.png';
import { useLocale } from '@kucoin-base/i18n';

import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';

const _list = [
  [
    { content: 'aboutus.ten.item1', id: 1, icon: Icon1, activeIcon: IconActive1 },
    { content: 'aboutus.ten.item2', id: 2, icon: Icon2, activeIcon: IconActive2 },
    { content: 'aboutus.ten.item3', id: 3, icon: Icon3, activeIcon: IconActive3 },
  ],
  [
    { content: 'aboutus.ten.item4', id: 4, icon: Icon4, activeIcon: IconActive4 },
    { content: 'aboutus.ten.item5', id: 5, icon: Icon5, activeIcon: IconActive5 },
  ],
  [
    { content: 'aboutus.ten.item6', id: 6, icon: Icon6, activeIcon: IconActive6 },
    { content: 'aboutus.ten.item7', id: 7, icon: Icon7, activeIcon: IconActive7 },
  ],
  [
    { content: 'aboutus.ten.item8', id: 8, icon: Icon8, activeIcon: IconActive8 },
    { content: 'aboutus.ten.item9', id: 9, icon: Icon9, activeIcon: IconActive9 },
    { content: 'aboutus.ten.item10', id: 10, icon: Icon10, activeIcon: IconActive10 },
  ],
];
const list = _list.flat();
const total = list.length;

const bgList = [
  { content: 'aboutus.ten.item1', id: 1, icon: Icon1, activeIcon: IconActive1, deg: 30 },
  { content: 'aboutus.ten.item2', id: 2, icon: Icon2, activeIcon: IconActive2, deg: 0 },
  { content: 'aboutus.ten.item3', id: 3, icon: Icon3, activeIcon: IconActive3, deg: 330 },
  { content: 'aboutus.ten.item8', id: 8, icon: Icon8, activeIcon: IconActive8, deg: 150 },
  { content: 'aboutus.ten.item9', id: 9, icon: Icon9, activeIcon: IconActive9, deg: 180 },
  { content: 'aboutus.ten.item10', id: 10, icon: Icon10, activeIcon: IconActive10, deg: 210 },
];

const smallList = [
  { content: 'aboutus.ten.item4', id: 4, icon: Icon4, activeIcon: IconActive4, deg: 30 },
  { content: 'aboutus.ten.item5', id: 5, icon: Icon5, activeIcon: IconActive5, deg: 330 },
  { content: 'aboutus.ten.item6', id: 6, icon: Icon6, activeIcon: IconActive6, deg: 150 },
  { content: 'aboutus.ten.item7', id: 7, icon: Icon7, activeIcon: IconActive7, deg: 210 },
];

const ImgBox = ({ imgSrc = '', activeSrc = '', id, index, onActive = () => {} }) => {
  const [isActive, setIsActive] = useState(id === index);

  const handleMouseOver = useCallback(() => {
    setIsActive(true);
  }, [setIsActive]);

  const hanldeMouseLeave = useCallback(() => {
    if (index !== id) setIsActive(false);
  }, [index, id, setIsActive]);

  useEffect(() => {
    setIsActive(id === index);
  }, [id, index]);

  return (
    <div
      className="bannerImgBox"
      onMouseOver={handleMouseOver}
      onMouseLeave={hanldeMouseLeave}
      onFocus={handleMouseOver}
      onBlur={hanldeMouseLeave}
      onClick={() => {
        onActive(id);
      }}
    >
      <img src={isActive ? activeSrc : imgSrc} alt="" />
    </div>
  );
};

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: #fff;
  padding: 0 ${px2rem(24)};
  height: ${px2rem(768)};
  overflow: hidden;
  ${(props) => props.theme.breakpoints.down('lg')} {
    height: ${px2rem(600)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    height: ${px2rem(460)};
    padding: 0 ${px2rem(12)};
  }
`;

const BgBox = styled.div`
  position: relative;
  height: 100%;
  margin: 0 auto;
  width: calc(100% - 70px);
  max-width: ${px2rem(1200)};
  .bannerImgBox {
    width: ${px2rem(70)};
    height: ${px2rem(70)};
    padding: ${px2rem(7)};
    background: #fff;
    ${(props) => props.theme.breakpoints.down('lg')} {
      width: ${px2rem(40)};
      height: ${px2rem(40)};
      padding: ${px2rem(4)};
    }
    ${(props) => props.theme.breakpoints.down('md')} {
      width: ${px2rem(30)};
      height: ${px2rem(30)};
      padding: ${px2rem(4)};
    }
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(100% - 40px);
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: calc(100% - 24px);
  }
`;

const BigBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
  }
  .bannerColumn {
    position: absolute;
    &[data-position='1'] {
      transform: translate3d(-50%, -50%, 0);
    }
    &[data-position='2'] {
      transform: translate3d(-50%, -50%, 0);
    }
    &[data-position='3'] {
      transform: translate3d(-50%, -50%, 0);
    }
    &[data-position='8'] {
      transform: translate3d(-50%, -50%, 0);
    }
    &[data-position='9'] {
      transform: translate3d(-50%, -50%, 0);
    }
    &[data-position='10'] {
      transform: translate3d(-50%, -50%, 0);
    }
  }
`;

const SmallBg = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  transform: translateX(-50%);
  max-width: ${px2rem(670)};
  width: calc(100% - 530px);
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(100% - 308px);
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 70%;
  }
  img {
    width: 100%;
  }
  .bannerColumn {
    position: absolute;
    &[data-position='4'] {
      transform: translate3d(-50%, -50%, 0);
    }
    &[data-position='5'] {
      transform: translate3d(-50%, -50%, 0);
    }
    &[data-position='6'] {
      transform: translate3d(-50%, -50%, 0);
    }
    &[data-position='7'] {
      transform: translate3d(-50%, -50%, 0);
    }
  }
`;

const BannerMain = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 10;
  height: 100%;
  transform: translateX(-50%);
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 54%;
    .banner6Title {
      margin-top: 32%;
      color: #000000;
      font-weight: 500;
      font-size: ${px2rem(18)};
      line-height: ${px2rem(18)};
      text-align: center;
    }
    .banner6Index {
      margin-bottom: ${px2rem(20)};
      color: #000000;
      font-weight: 500;
      font-size: ${px2rem(20)};
      text-align: center;
    }
    .banner6Text {
      height: ${px2rem(60)};
      color: #000000;
      font-weight: 400;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(20)};
      text-align: center;
      animation: fadeIn 0.5s;
    }
    .banner6Pointer {
      display: flex;
      justify-content: center;
      .banner6Cur {
        color: #000000;
        font-weight: 400;
        font-size: ${px2rem(14)};
      }
      .banner6Total {
        color: rgba(0, 0, 0, 0.6);
        font-weight: 400;
        font-size: ${px2rem(14)};
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    width: 44%;
    .banner6Title {
      margin-top: 10%;
      color: #000000;
      font-weight: 500;
      font-size: ${px2rem(38)};
      line-height: ${px2rem(40)};
      text-align: center;
    }
    .banner6Index {
      margin-bottom: ${px2rem(30)};
      color: #000000;
      font-weight: 500;
      font-size: ${px2rem(40)};
      text-align: center;
    }
    .banner6Text {
      height: ${px2rem(60)};
      margin-bottom: 104px;
      color: #000000;
      font-weight: 400;
      font-size: ${px2rem(24)};
      line-height: ${px2rem(30)};
      text-align: center;
      animation: fadeIn 0.5s;
    }
    .banner6Pointer {
      display: flex;
      justify-content: center;
      .banner6Cur {
        color: #000000;
        font-weight: 400;
        font-size: ${px2rem(16)};
      }
      .banner6Total {
        color: rgba(0, 0, 0, 0.6);
        font-weight: 400;
        font-size: ${px2rem(16)};
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: ${px2rem(500)};
    .banner6Title {
      margin-top: ${px2rem(103)};
      color: #000000;
      font-weight: 500;
      font-size: ${px2rem(38)};
      line-height: ${px2rem(40)};
      text-align: center;
    }
    .banner6Index {
      margin-bottom: ${px2rem(30)};
      color: #000000;
      font-weight: 500;
      font-size: ${px2rem(40)};
      text-align: center;
    }
    .banner6Text {
      height: ${px2rem(60)};
      margin-bottom: 104px;
      color: #000000;
      font-weight: 400;
      font-size: ${px2rem(24)};
      line-height: ${px2rem(30)};
      text-align: center;
      animation: fadeIn 0.5s;
    }
    .banner6Pointer {
      display: flex;
      justify-content: center;
      .banner6Cur {
        color: #000000;
        font-weight: 400;
        font-size: ${px2rem(16)};
      }
      .banner6Total {
        color: rgba(0, 0, 0, 0.6);
        font-weight: 400;
        font-size: ${px2rem(16)};
      }
    }
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
`;

const Banner6 = (effect, deps) => {
  const [index, setIndex] = useState(1);
  const [ready, setReady] = useState(false);
  const [innerWidth, setInnerWidth] = useState();
  const [outerWidth, setOuterWidth] = useState();
  const [outerHeight, setOuterHeight] = useState();
  const [interHeight, setInnerHeight] = useState();

  const outRef = useRef();
  const innerRef = useRef();

  useLocale();

  const handlePre = useCallback(() => {
    const _newIndex = index >= 2 ? index - 1 : total;
    setIndex(_newIndex);
  }, [index, setIndex]);

  const handleNext = useCallback(() => {
    const _newIndex = index < total ? index + 1 : 1;
    setIndex(_newIndex);
  }, [index, setIndex]);

  const handleActive = useCallback(
    (_index) => {
      setIndex(_index);
    },
    [setIndex],
  );

  const handleSize = () => {
    const { width: _outerWidth, height: _outerHeight } = outRef.current.getBoundingClientRect();
    const { width: _innerWidth, height: _innerHeight } = innerRef.current.getBoundingClientRect();
    setOuterWidth(_outerWidth);
    setInnerWidth(_innerWidth);
    setOuterHeight(_outerHeight);
    setInnerHeight(_innerHeight);
  };

  const getPosition = (width, height, radia) => {
    const top = height - width * Math.sin(radia);
    const left = width - width * Math.cos(radia);
    return {
      top,
      left,
    };
  };

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      handleSize();
    }
  }, [ready]);

  useEffect(() => {
    window.addEventListener('resize', handleSize, false);
    return () => {
      window.removeEventListener('resize', handleSize, false);
    };
  }, []);

  return (
    <Wrapper data-inspector="about_us_rules" className="wow fadeInUp">
      <BgBox>
        <BigBg ref={outRef}>
          <img src={CircleImg} alt="" />
          {_.map(bgList, (item) => {
            const { id, deg } = item;
            const { top, left } = getPosition(
              outerWidth / 2,
              outerHeight / 2,
              (deg * Math.PI) / 180,
            );
            return (
              <div
                style={{ top: px2rem(top), left: px2rem(left) }}
                className="bannerColumn"
                data-position={id}
                key={id}
              >
                <ImgBox
                  imgSrc={item.icon}
                  activeSrc={item.activeIcon}
                  key={item.id}
                  id={item.id}
                  index={index}
                  onActive={handleActive}
                />
              </div>
            );
          })}
        </BigBg>
        <SmallBg ref={innerRef}>
          <img src={CircleImg} alt="" />
          {_.map(smallList, (item) => {
            const { id, deg } = item;
            const { top, left } = getPosition(
              innerWidth / 2,
              interHeight / 2,
              (deg * Math.PI) / 180,
            );
            return (
              <div
                style={{ top: px2rem(top), left: px2rem(left) }}
                className="bannerColumn"
                data-position={id}
                key={id}
              >
                <ImgBox
                  imgSrc={item.icon}
                  activeSrc={item.activeIcon}
                  key={item.id}
                  id={item.id}
                  index={index}
                  onActive={handleActive}
                />
              </div>
            );
          })}
        </SmallBg>
      </BgBox>
      <BannerMain>
        <div className="banner6Title">{_t('aboutus.ten.title')}</div>
        <ContentWrapper>
          <div className="banner6Index">{index}</div>
          {/* 遍历是为了切换动画 */}
          {_.map(list, (item) => (
            <div
              className="banner6Text"
              style={{
                display: item.id === index ? 'block' : 'none',
              }}
              key={item.id}
            >
              {_t(item.content)}
            </div>
          ))}
          <div className="banner6Pointer">
            <Pointer
              onPre={handlePre}
              onNext={handleNext}
              current={index}
              total={total}
              curClassName="banner6Cur"
              totalClassName="banner6Total"
            />
          </div>
        </ContentWrapper>
      </BannerMain>
    </Wrapper>
  );
};

export default Banner6;
