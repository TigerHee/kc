/*
 * @Owner: jesse.shao@kupotech.com
 */
/* * Owner: tom@kupotech.com  * */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { _t } from 'utils/lang';
import arrowRightSvg from 'assets/cryptoCup/arrow-right.svg';

const GuideWrapper = styled.div`
  width: 100%;
  min-height: 70px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 112px 17px 128px 17px;
  margin: -100px 0;
  background: linear-gradient(180deg, #ffffff 5.93%, #f5fffd 12.59%);
`;

const GuideItem = styled.div`
  /* width: ${props => (props.long ? '25.2%' : '14.7%')}; */
  font-size: 10px;
  line-height: 130%;
  color: rgba(0, 13, 29, 0.68);
  word-break: break-word;
  text-align: center;
`;

const ArrowRight = styled.img`
  width: 6.5%;
`;

function Guide() {
  return (
    <GuideWrapper>
      <GuideItem>{_t('cryptoCup.banner.li1')}</GuideItem>
      <ArrowRight src={arrowRightSvg} alt="" />
      <GuideItem>{_t('cryptoCup.banner.li2')}</GuideItem>
      <ArrowRight src={arrowRightSvg} alt="" />
      <GuideItem>{_t('cryptoCup.banner.li3')}</GuideItem>
      <ArrowRight src={arrowRightSvg} alt="" />
      <GuideItem long>{_t('cryptoCup.banner.li4')}</GuideItem>
    </GuideWrapper>
  );
}

export default Guide;
