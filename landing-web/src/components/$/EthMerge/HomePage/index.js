/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@kufox/mui/emotion';

import Banner from 'components/$/EthMerge/Banner';
import BANNER_BG from 'assets/eth-merge/banner-bg.png';
import FOOTER_LOGO from 'assets/eth-merge/footer-logo.png';

import Detail from 'src/components/$/EthMerge/Detail';
import ActivityCalendar from 'src/components/$/EthMerge/ActivityCalendar';

import CoinList from 'src/components/$/EthMerge/CoinList';
import MoneyManage from 'src/components/$/EthMerge/MoneyManage';
import Community from 'src/components/$/EthMerge/Community';

import { _t } from 'src/utils/lang';
import { px2rem } from '@kufox/mui/utils';
import { StarIcon } from './StyledComps';

// --- 样式 start ---
const HomePage = styled.div`
  position: absolute;
  width: 100%;
  /* height: 100%; */
  flex: 1;
  display: flex;
  flex-direction: column;
  background: url(${BANNER_BG}) no-repeat;
  background-size: 100% auto;
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  span {
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 14px;
    line-height: 130%;
    /* or 18px */

    text-align: center;

    color: #ffffff;

    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  }
`;

// --- 样式 end---

const PageFooter = () => {
  return (
    <FooterWrapper>
      <span>{_t('oKezXoVX7gQDTevdxpHxER')}</span>
      <img src={FOOTER_LOGO} alt="coming soon" width={182} />
    </FooterWrapper>
  );
};

const Home = ({ goShare }) => {
  return (
    <HomePage>
      <StarIcon
        fill="currentColor"
        style={{
          width: 20,
          height: 20,
          top: px2rem(170),
          right: px2rem(101.5),
          animationDuration: '1.5s',
        }}
      />
      <StarIcon
        fill="currentColor"
        style={{ width: 10, height: 10, top: px2rem(240), right: px2rem(100.48) }}
      />
      <StarIcon
        fill="currentColor"
        style={{
          width: 20,
          height: 20,
          top: px2rem(256),
          right: px2rem(44.66),
          animationDuration: '2s',
        }}
      />
      <Banner />
      <Detail goShare={goShare} />
      <ActivityCalendar />
      <CoinList />
      <MoneyManage />
      <Community />
      <PageFooter />
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
