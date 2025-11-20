/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import SvgIcon from 'components/common/KCSvgIcon';
// import { _t } from 'tools/i18n';
import style from './style.less';

// const iconSize = {
//   width: 14,
//   height: 14,
//   marginRight: 6,
// };

const Head = ({
  // isLogin, showRecords, handleSetShowRecords, handleSetHideRecords,
  item,
}) => {
  const imgUrl = item && item.image_url ? item.image_url : null;
  return (
    <div className={style.head}>
      {imgUrl && <img className={style.banner} src={imgUrl} alt="" />}
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

export default connect((state) => {
  return {
    isLogin: state.user.isLogin,
  };
})(Head);
