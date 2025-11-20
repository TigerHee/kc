/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Share, HeaderWrapper, RightWrapper, ExtraPadding } from './StyledComps';

import LangSelector from 'components/Header/LangSelector';
import { ReactComponent as ArrowBack } from 'assets/lunc/arrow-left.svg';
import SHARESVG from 'assets/lunc/share.svg';
import LANG_CHECKED from 'assets/NFTQuiz/lang_icon.svg';
import { useHistory, useSelector } from 'dva';
import styles from './index.less';
import jsBridge from 'src/utils/jsBridge';
import { Event } from 'src/helper';

const Header = ({ goShare }) => {
  const headRef = useRef();
  const [isSticky, setIsSticky] = useState(false);
  const { isInApp } = useSelector(state => state.app);

  const { goBack } = useHistory();

  const handleGoBack = () => {
    // 首页的返回，则退出
    if (isInApp) {
      jsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    } else {
      goBack();
    }
  };

  useEffect(() => {
    const handleScroll = e => {
      if (headRef.current) {
        const scrollTop = e.target.scrollTop;
        // const { height } = headRef.current.getBoundingClientRect();
        if (scrollTop > 44) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    let scrollEl = document.getElementById('LUNC_SCROLL_EL');
    if (scrollEl) {
      Event.addHandler(scrollEl, 'scroll', handleScroll);
    }
    return () => {
      if (scrollEl) {
        Event.removeHandler(scrollEl, 'scroll', handleScroll);
      }
    };
  }, []);

  return (
    <HeaderWrapper ref={headRef} isSticky={isSticky} isInApp={isInApp}>
      <ArrowBack onClick={handleGoBack} className={styles.arrowBack} />
      <RightWrapper>
        <LangSelector
          className={styles['land-lang-selector-dark']}
          checkedImgUrl={LANG_CHECKED}
          showCheckedImg
        />
        <Share src={SHARESVG} alt="SHARESVG" onClick={goShare} />
      </RightWrapper>
    </HeaderWrapper>
  );
};

Header.propTypes = {
  goShare: PropTypes.func.isRequired, // 点击分享的回调
};

Header.defaultProps = {
  goShare: () => {},
};

export default React.memo(Header);
