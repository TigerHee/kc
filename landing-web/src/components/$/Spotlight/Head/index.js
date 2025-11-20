/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'kc-svg-sprite';
import { _t } from 'utils/lang';
import style from './style.less';
import logo from 'assets/spotlight/spotlight.svg';

const iconSize = {
  width: 14,
  height: 14,
  marginRight: 6,
};

const Head = ({ isLogin, showRecords, handleSetShowRecords, handleSetHideRecords }) => {
  const _handleSetShowRecords = (e) => {
    e.preventDefault();
    handleSetShowRecords(e);
  }
  const _handleSetHideRecords = (e) => {
    e.preventDefault();
    handleSetHideRecords(e);
  }
  return (
    <div className={style.head}>
      <img src={logo} alt="Spotlight" />
      {isLogin && (
        showRecords ? (
          <a href='#hide-records' className={style.records} onClick={_handleSetHideRecords}>
            <SvgIcon iconId="arrow-back" style={iconSize} />
            {_t('spotlight.back')}
          </a>
        ) : (
          <a href='#show-records' className={style.records} onClick={_handleSetShowRecords}>
            <SvgIcon iconId="records-blue-fill" style={iconSize} />
            {_t('spotlight.buy.records')}
          </a>
        )
      )}
    </div>
  );
};

Head.propTypes = {
  showRecords: PropTypes.bool.isRequired,
  handleSetShowRecords: PropTypes.func.isRequired,
  handleSetHideRecords: PropTypes.func.isRequired,
};

export default connect((state) => {
  return {
    isLogin: state.user.isLogin,
  };
})(Head);
