/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import SvgIcon from 'kc-svg-sprite';
// import { _t } from 'utils/lang';
// import { px2rem } from 'helper';
import style from './style.less';
import logo from 'assets/spotlight/activity.svg';
import logoEn from 'assets/spotlight/spotlightEn.svg';

// const iconSize = {
//   width: px2rem(14),
//   height: px2rem(14),
//   marginRight: px2rem(6),
// };

const Head = ({ isCN, isLogin, showRecords, handleSetShowRecords, handleSetHideRecords, isNewSpotlight8 }) => {
  return (
    <div className={style.head}>
      {!isNewSpotlight8 && <img src={isCN ? logo : logoEn} alt="Spotlight" />}
      {/* {isLogin && (
        showRecords ? (
          <a className={style.records} onClick={handleSetHideRecords}>
            <SvgIcon iconId="arrow-back" style={iconSize} />
            {_t('spotlight.back')}
          </a>
        ) : (
          <a className={style.records} onClick={handleSetShowRecords}>
            <SvgIcon iconId="records-blue-fill" style={iconSize} />
            {_t('spotlight.buy.records')}
          </a>
        )
      )} */}
    </div>
  );
};

Head.propTypes = {
  showRecords: PropTypes.bool.isRequired,
  // handleSetShowRecords: PropTypes.func.isRequired,
  // handleSetHideRecords: PropTypes.func.isRequired,
};

export default connect((state) => {
  const currentLang = state.app.currentLang;
  return {
    isLogin: state.user.isLogin,
    isCN: currentLang === 'zh_CN',
  };
})(Head);
