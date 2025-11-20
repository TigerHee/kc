/**
 * Owner: terry@kupotech.com
 */
import React from 'react';
import mainFlagIcon from 'assets/invite/coupon/flag-main.svg'; 
import otherFlagIcon from 'assets/invite/coupon/flag-other.svg'; 
import mainShape from 'assets/invite/coupon/shape-main.svg';
import OtherShape from 'assets/invite/coupon/shape-other.svg';
import mainBtn from 'assets/invite/coupon/btn-main.svg';
import OtherBtn from 'assets/invite/coupon/btn-other.svg';
import StartLeftIcon from 'assets/invite/coupon/star-left.svg';
import StartRightIcon from 'assets/invite/coupon/star-right.svg';
import mainIcon from 'assets/invite/coupon/main-icon.svg'
import testIcon from 'assets/invite/coupon/test.png';
import emptyIcon from 'assets/invite/coupon/empty-icon.svg';
import {
  CouponWrapper,
} from './styled';



const Coupon = ({ main, title, btnText, icon, topMargin = true, isLotteryEmpty }) => {

  const flagSrc = main ? mainFlagIcon : otherFlagIcon;
  const shapeBg = main ? mainShape : OtherShape;
  const btnBg = main ? mainBtn : OtherBtn;
  return (
    <CouponWrapper main={main} shape={shapeBg} btn={btnBg} topMargin={topMargin}>
      <div className='title'>
        <p className='content'>
          <span>{title}</span>
        </p>
      </div>
      <img src={flagSrc} alt="flag" className='flag' />
      <div className='shape'>
        {
          !isLotteryEmpty && (
            <img src={StartLeftIcon} alt="left-icon" className='left' />
          )
        }
        {
          !isLotteryEmpty && (
            <img src={StartRightIcon} alt="right-icon" className='right' />
          )
        }
        <img src={isLotteryEmpty ? emptyIcon : main ? mainIcon : icon || testIcon} alt="main-icon" className='main' />
      </div>
      <div className='btn'>
        <span className='btn-title'>
          <span>{btnText}</span>
        </span>
      </div>
    </CouponWrapper>
  )
};

export default Coupon;