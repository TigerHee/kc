/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import SvgIcon from 'components/common/KCSvgIcon';
// import { _t } from 'tools/i18n';
import style from './style.less';
import logo from 'static/spotlight/spotlight.svg';

// const iconSize = {
//   width: 14,
//   height: 14,
//   marginRight: 6,
// };

const Head = () =>
  // { isLogin, showRecords, handleSetShowRecords, handleSetHideRecords }
  {
    return (
      <div className={style.head}>
        <img src={logo} alt="Spotlight" />
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
  handleSetShowRecords: PropTypes.func.isRequired,
  handleSetHideRecords: PropTypes.func.isRequired,
};

Head.defaultProps = {
  showRecords: false,
  handleSetShowRecords: () => {},
  handleSetHideRecords: () => {},
};

export default connect((state) => {
  return {
    isLogin: state.user.isLogin,
  };
})(Head);
