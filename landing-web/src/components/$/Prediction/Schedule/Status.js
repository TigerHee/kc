/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { DIALOG_TYPE } from 'components/$/Prediction/config';
import { _tHTML } from 'src/utils/lang';

import { StatusWrapper, Img } from './StyledComps';
import TIP_BLACK from 'assets/prediction/tip-black.svg';
import TIP_WHITE from 'assets/prediction/tip-white.svg';

const Status = ({ onTipClick, isActive, time, text }) => {
  return (
    <StatusWrapper isActive={isActive}>
      <div className="statusTitle">
        {_tHTML('prediction.quizeEndPrice', { a: time })}
        <Img
          className="processTip"
          onClick={() => onTipClick(DIALOG_TYPE.SCHEDULE_TIP)}
          src={isActive ? TIP_WHITE : TIP_BLACK}
          alt=""
        />
      </div>
      <div className="status-text">{text}</div>
    </StatusWrapper>
  );
};

Status.propTypes = {
  time: PropTypes.any, // 场次时间
  text: PropTypes.string, // 状态文案
  onTipClick: PropTypes.func.isRequired, // 点击小问号时的回调
  isActive: PropTypes.bool, // 是否激活状态
};

Status.defaultProps = {
  time: '',
  onTipClick: () => {},
  isActive: false,
  text: '',
};
export default Status;
