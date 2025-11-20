/**
 * Owner: melon@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@kux/mui/emotion';

const PercentWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 20px;
  background-color: rgba(243, 243, 243, 0.04);
  border-radius: 0 10px 10px 0;
`;

const PercentLine = styled.div`
  counter-reset: percent ${props => props.percent};
  height: inherit;
  width: ${props => props.percent}%;
  background-color: ${props => props.bg};
  border-radius: 0 10px 10px 0;
  transition: all .5s ease;
  transition-delay: 1s;
`;

const PercentText = styled.span`
  margin-left: 4px;
  display: flex;
  align-items: center;
  color: ${props => props.color};
  height: inherit;
  font-size: 14px;
`;

/**
 *
 * 传入percent，生成占比条
 * @param {*}
 * @percent 占比条进度控制
 * @bgColor 占比条颜色
 * @wrapperBgColor 未占比背景颜色
 * @returns jsx
 */
const Index = ({ percent, bgColor, wrapperBgColor, classes, textColor, showNumber, animated }) => {
  let linePercent = percent;
  if (percent < 0) {
    linePercent = 0;
  } else if (percent > 100) {
    linePercent = 100;
  }
  return (
    <PercentWrapper className={classes?.wrapper} bg={wrapperBgColor}>
      <PercentLine
        className={classes?.percentLine}
        percent={linePercent}
        bg={bgColor}
        animated={animated}
      />
      <React.Fragment>
        {showNumber ? (
          <PercentText
            className={classes?.text}
            percent={linePercent}
            color={textColor}
            animated={animated}
          >{`${percent}%`}</PercentText>
        ) : (
          ''
        )}
      </React.Fragment>
    </PercentWrapper>
  );
};

Index.propTypes = {
  percent: PropTypes.number.isRequired, // 占比数字 >0 的数字
  bgColor: PropTypes.string, // 占比条颜色
  textColor: PropTypes.string, // 占比数字字体颜色
  showNumber: PropTypes.bool, // 是否展示占比数字
  wrapperBgColor: PropTypes.string, // 未占比背景颜色
  classes: PropTypes.object, // 复写class
  animated: PropTypes.bool, // 是否需要渐长动画
};

Index.defaultProps = {
  percent: 0,
  bgColor: '#2DBD96',
  wrapperBgColor: '#13161B',
  textColor: '#2DBD96',
  showNumber: true,
  classes: {
    wrapper: '', // 未占比wrapper
    percentLine: '', // 占比wrapper
    text: '', // 文案样式
  },
  animated: true,
};

export default React.memo(Index);
