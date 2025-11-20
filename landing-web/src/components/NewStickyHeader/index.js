/**
 * Owner: melon@kupotech.com
 */
import React, { useCallback } from 'react';
import { styled } from '@kufox/mui/emotion';
import { isFunction } from 'lodash';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import { _t } from 'utils/lang';

import ArrowBackSvg from 'assets/global/arrow-left.svg';

// 样式 start
// header
const Header = styled.div`
  background: transparent;
  top: 0;
  z-index: 999;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: 88px;
  padding: 0 24px;
  cursor: pointer;
  ${(props) =>
    props.isSticky ? `background: ${props.theme.colors.background}; position: sticky;` : ''}
  ${(props) => props.theme.breakpoints.down('md')} {
    height: 88px;
    padding: 44px 16px 16px;
  }
`;

const ImgButton = styled.img`
  width: 24px;
  height: 24px;
  /* 中屏 大屏样式 */
  ${(props) => props.theme.breakpoints.up('md')} {
    cursor: pointer;
  }
`;
const Left = styled.div`
  display: flex;
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  white-space: nowrap;
  text-align: center;
`;
const Placeholder = styled.div`
  min-width: 24px;
`;

const LeftWrapper = styled.div`
  ${props => props.fixLeft && `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: ${props.fixLeft}px;
  `}
`;

// 样式 end
/**
 * h5的header
 * @param isSticky 默认为 false, 为true的时候吸顶
 * @param layoutType 默认为 center；
 *
 * left : 靠左 title和返回图案一起 布局为<>返回图案 title</> <>右边自定义操作区</>
 * center : 居中 布局为<>返回图案</> <>title</><>右边自定义操作区</>
 */
const H5HeaderNew = ({
  onClickBack,
  arrowBackSrc,
  title,
  rightContent,
  isInApp,
  className = '',
  layoutType,
  isSticky,
  fixLeft,
}) => {
  const { goBack } = useHistory();
  const onBack = useCallback(() => {
    if (isFunction(onClickBack)) {
      return onClickBack();
    } else {
      return goBack();
    }
  }, [onClickBack, goBack]);
  const leftLayout = (
    <>
      <Left>
        <ImgButton
          className="Ku-new-h5-header-img-button"
          onClick={onBack}
          src={arrowBackSrc || ArrowBackSvg}
          alt=""
        />
        <Title className="Ku-new-h5-header-title">{title}</Title>
      </Left>
      <Placeholder className="Ku-new-h5-header-right-content">{rightContent}</Placeholder>
    </>
  );
  const centerLayout = (
    <>
      <LeftWrapper fixLeft={fixLeft}>
        <ImgButton
          className="Ku-new-h5-header-img-button"
          onClick={onBack}
          src={arrowBackSrc || ArrowBackSvg}
          alt=""
        />
      </LeftWrapper>
      <Title className="Ku-new-h5-header-title">{title}</Title>
      <Placeholder className="Ku-new-h5-header-right-content">{rightContent}</Placeholder>
    </>
  );

  if (layoutType === 'left') {
    return (
      <Header isSticky={isSticky} isInApp={isInApp} className={className}>
        {leftLayout}
      </Header>
    );
  }
  return (
    <Header isSticky={isSticky} isInApp={isInApp} className={className}>
      {centerLayout}
    </Header>
  );
};

H5HeaderNew.propTypes = {
  arrowBackSrc: PropTypes.string, // < 图片src
  onClickBack: PropTypes.func, // 点击 < 图片调用
  title: PropTypes.string, // 标题
  rightContent: PropTypes.any, // 右边的操作
  isInApp: PropTypes.bool, // 是否在app中
  isSticky: PropTypes.bool, // 是否吸顶
  layoutType: PropTypes.oneOf(['left', 'center']), // title 布局
  className: PropTypes.string, // header 复写class
};

H5HeaderNew.defaultProps = {
  arrowBackSrc: undefined,
  onClickBack: () => {},
  title: '',
  rightContent: undefined,
  isInApp: false,
  isSticky: false,
  layoutType: 'center',
};

export default H5HeaderNew;
