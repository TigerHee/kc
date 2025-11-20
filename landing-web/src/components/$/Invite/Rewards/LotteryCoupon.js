/**
 * Owner: terry@kupotech.com
 */
import React, { useRef, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'dva';
import { useMediaQuery } from '@kufox/mui/hooks';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { _t } from 'utils/lang';
import { isRTLLanguage } from 'utils/langTools';
import { formatNumber } from 'helper';
import { ReactComponent as ArrowRight } from 'assets/invite/coupon/ic-arrow-left.svg';
import map from 'lodash/map';
import noop from 'lodash/noop';
import isEmpty from 'lodash/isEmpty';
import Coupon from './Coupon';
import { GoBtn } from './styled';
import {
  LotteryCouponCard,
  Tag,
  SliderWrapper,
  CouponBox,
  LotteryWrapper,
} from '../styles';


const Btn = ({ isNext, onClick = noop, disabled = false }) => {
  return (
    <GoBtn disabled={disabled} onClick={onClick} isNext={isNext}>
      <ArrowRight />
    </GoBtn>
  )
};


// 空占位奖品
const emptyLottery = [
  {
    title: '--',
    btnText: '--',
  },
  {
    title: '--',
    btnText: '--',
  },
  {
    title: '--',
    btnText: '--',
  },
  {
    title: '--',
    btnText: '--',
  },
  {
    title: '--',
    btnText: '--',
  },
];

const LotteryCoupon = ({ tagRef }) => {
  const {
    location: {
      query = {},
    },
  } = useHistory();
  const { subject } = query || {};
  const { activityInfo } = useSelector((state) => state.invite);
  const { currentLang } = useSelector(state => state.app);
  const isRTL = isRTLLanguage(currentLang);
  const isMobile = useMediaQuery(() => {
    return "@media (max-width: 1150px)";
  });
  const slideRef = useRef();
  const indexRef = useRef(0);
  const nextClick = () => {
    slideRef.current?.slickNext();
  }
  const prevClick = () => {
    slideRef.current?.slickPrev();
  }

  const { couponList, isLotteryEmpty } = useMemo(() => {
    const { prizeConfigDetails = [] } = activityInfo || {};
    const isLotteryEmpty = !subject || isEmpty(prizeConfigDetails);
    const list = isLotteryEmpty ? emptyLottery : map(prizeConfigDetails, detail => {
      const isOnlyName = detail.prizeValue == 0;
      const prizeValue = detail.prizeValue;
      const _value = formatNumber(prizeValue, 2);
      return {
        title: detail.prizeName || '--',
        btnText: isOnlyName ? '--' : `${_value} ${window._BASE_CURRENCY_}`,
        icon: detail.prizeLogo,
      }
    });
    return { couponList: [...list, ...list], isLotteryEmpty };
  }, [subject, activityInfo]);

  const setting = {
    className: 'customSlider',
    dots: false,
    arrows: false,
    infinite: !isLotteryEmpty,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: false,
    speed: 1000,
    cssEase: "linear",
    nextArrow: null,
    prevArrow: null,
    autoplay: !isLotteryEmpty,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    swipe: false,
    touchMove: false,
    rtl: isRTL,
    afterChange: (current) => {
      indexRef.current = current
    },
  }

  useEffect(() => {
    if (isLotteryEmpty) return;
    setTimeout(() => {
      slideRef.current?.slickPlay();
    }, 600);
  }, [isLotteryEmpty]);

  return (
    <LotteryCouponCard>
      <Tag lottery ref={tagRef}>{_t('gT14XYqbsrn9PZJx8YyLKQ')}</Tag>
      <LotteryWrapper>
        {
          !isMobile && couponList.length < 1 ? (
            <>
              <Btn
                isNext={false}
                onClick={prevClick}
              />
              <Slider {...setting} ref={slideRef}>
                {map(couponList, (lottery, index) => (
                  <Coupon
                    key={index}
                    topMargin={false}
                    main={false}
                    title={lottery.title}
                    btnText={lottery.btnText}
                    isLotteryEmpty={isLotteryEmpty}
                    icon={lottery.icon}
                  />
                ))}
              </Slider>
              <Btn
                isNext
                onClick={nextClick}
              />
            </>
          ) : (
            <CouponBox>
              <SliderWrapper time='16s' isLotteryEmpty={isLotteryEmpty}>
                {map(couponList, (lottery, index) => (
                  <Coupon
                    key={index}
                    topMargin={false}
                    main={false}
                    title={lottery.title}
                    btnText={lottery.btnText}
                    isLotteryEmpty={isLotteryEmpty}
                    icon={lottery.icon}
                  />
                ))}
              </SliderWrapper>
            </CouponBox>
          )
        }
      </LotteryWrapper>
    </LotteryCouponCard>
  );
};

export default LotteryCoupon;