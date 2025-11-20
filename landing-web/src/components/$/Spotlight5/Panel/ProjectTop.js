/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import style from './style.less';

const ProjectTop = ({ title, notStart, restSec, handleCountEnd, handleCountChange }) => {
  return (
    <div className={style.projectTop}>
      <div className={style.projectName}>{ title }</div>
    </div>
  );
};

ProjectTop.propTypes = {
  title: PropTypes.string, // 活动的 page_title
  notStart: PropTypes.bool, // 活动是否未开始
  restSec: PropTypes.number, // 剩余开始秒数
  handleCountEnd: PropTypes.func, // 读秒结束触发的函数
  handleCountChange: PropTypes.func, // 读秒改变的函数
};

ProjectTop.defaultProps = {
  title: '',
  notStart: false,
  restSec: 0,
  handleCountEnd: () => {},
  handleCountChange: () => {},
};

export default ProjectTop;
