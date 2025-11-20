/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector } from 'dva';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { useHistory } from 'react-router';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';
import JsBridge from 'utils/jsBridge';

import LogoImg from 'assets/apiKing/logo.png';
import leftImg from 'assets/global/back.svg';
import styles from './style.less';

//左边的logo小组件
const LeftLogo = ({ showLogo, logoUrl, onClickGoBack, onClickLogo, logoStyle }) => {
  const { isInApp } = useSelector(state => state.app);
  const {
    goBack,
  } = useHistory();
  // 点击logo
  const handleLogo = useCallback(() => {
    if (onClickLogo && isFunction(onClickLogo)) {
      onClickLogo();
      return;
    }
    // app 中跳转回App 首页
    if (isInApp) {
      JsBridge.open({ type: 'jump', params: { url: '/home?page=0' } });
    } else {
      const newPage = window.open(KUCOIN_HOST, '_self');
      newPage.opener = null;
    }
  }, [isInApp, onClickLogo]);
  // 点击goBack
  const handleBack = useCallback(() => {
    if (onClickGoBack && isFunction(onClickGoBack)) {
      onClickGoBack();
      return;
    }
    // 首页的返回，则退出
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    } else {
      goBack()
    }
  }, [isInApp, onClickGoBack, goBack]);

  if (showLogo) {
    //展示logo
    return (
      <div className={styles.leftImgBox} onClick={handleLogo}>
        <img className={styles.LogoImg} style={logoStyle} src={logoUrl || LogoImg} alt="logo" />
      </div>
    );
  }
  return (
    <div className={styles.leftBox} onClick={handleBack}>
      <img className={styles.leftIcon} src={leftImg} alt="logo" />
    </div>
  );
};

LeftLogo.propTypes = {
  showLogo: PropTypes.bool, // 是否展示Logo
  logoUrl: PropTypes.string, // logo图片url
  logoStyle: PropTypes.object, // logo样式
  onClickGoBack: PropTypes.func, // 点击返回回调
  onClickLogo: PropTypes.func, // 点击logo 回调
};

LeftLogo.defaultProps = {
  showLogo: true,
  logoUrl: undefined,
  logoStyle: {},
  onClickGoBack: undefined,
  onClickLogo: undefined,
};

export default LeftLogo;
