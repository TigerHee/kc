/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@kufox/mui/emotion';

import Banner from 'components/$/Lunc/Banner';
import BANNER_BG from 'assets/lunc/banner-bg.png';

import Detail from 'src/components/$/Lunc/Detail';
import ActivityCalendar from 'src/components/$/Lunc/ActivityCalendar';

import CoinList from 'src/components/$/Lunc/CoinList';
import Community from 'src/components/$/Lunc/Community';


// --- 样式 start ---
const HomePage = styled.div`
  position: absolute;
  width: 100%;
  /* height: 100%; */
  flex: 1;
  display: flex;
  flex-direction: column;
 
  &:before {
    content: ' ';
    background: url(${BANNER_BG}) no-repeat;
    background-size: 100% auto;
    position: absolute;
    width: 100%;
    height: 100%;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;

// --- 样式 end---


const Home = ({ goShare }) => {
  return (
    <HomePage>
      <Banner />
      <Detail goShare={goShare} />
      <CoinList />
      <ActivityCalendar />
      <Community />
    </HomePage>
  );
};

Home.propTypes = {
  btnClickCheck: PropTypes.func.isRequired, // 点击前置验证
};

Home.defaultProps = {
  btnClickCheck: () => {},
};

export default Home;
