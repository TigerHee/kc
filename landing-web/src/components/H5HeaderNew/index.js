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
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #00142a;
  padding: 20px 10px;
  margin-top: ${(props) => (props.isInApp ? '32pt' : '32px')};
  @media (min-width: 1040px) {
    margin-top: 0;
  }
`;
// 固定header
const FixHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #00142a;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
  background: #f7f8fb;
  padding: 10px 16px;
  height: 88px;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding-top: ${(props) =>
      props.isInApp ? 'calc(32pt + 10px)' : 'calc(32px + 10px)'}; // h5和App样式都要考虑刘海屏幕
  }
  .Ku-new-h5-header-title {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
  }
`;
const ImgButton = styled.img`
  width: 24px;
  height: 24px;
  @media (min-width: 1040px) {
    cursor: pointer;
  }
`;
const Left = styled.div`
  display: flex;
`;
const Title = styled.div`
  font-size: 18px;
  line-height: 130%;
`;
const Placeholder = styled.div`
  min-width: 24px;
`;
// 样式 end
/**
 * h5的header
 * @param fixed 默认为false； fixed定位在top的Header 和 直排非fixed的Header
 * @param layoutType 默认为 center；
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
  fixed,
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
        <Title className="Ku-new-h5-header-title">{title || _t('prediction.activationList')}</Title>
      </Left>
      <Placeholder className="Ku-new-h5-header-right-content">{rightContent}</Placeholder>
    </>
  );
  const centerLayout = (
    <>
      <ImgButton
        className="Ku-new-h5-header-img-button"
        onClick={onBack}
        src={arrowBackSrc || ArrowBackSvg}
        alt=""
      />
      <Title className="Ku-new-h5-header-title">{title || _t('prediction.activationList')}</Title>
      <Placeholder className="Ku-new-h5-header-right-content">{rightContent}</Placeholder>
    </>
  );

  if (fixed) {
    if (layoutType === 'left') {
      return (
        <FixHeader isInApp={isInApp} className={className}>
          {leftLayout}
        </FixHeader>
      );
    }
    return (
      <FixHeader isInApp={isInApp} className={className}>
        {centerLayout}
      </FixHeader>
    );
  }

  if (layoutType === 'left') {
    return (
      <Header isInApp={isInApp} className={className}>
        {leftLayout}
      </Header>
    );
  }
  return (
    <Header isInApp={isInApp} className={className}>
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
  layoutType: PropTypes.oneOf(['left', 'center']), // title 布局
  fixed: PropTypes.bool, // 位置是否固定
  className: PropTypes.string, // header 复写class
};

H5HeaderNew.defaultProps = {
  arrowBackSrc: undefined,
  onClickBack: () => {},
  title: '',
  rightContent: undefined,
  isInApp: false,
  layoutType: 'center',
  fixed: false,
};

export default H5HeaderNew;
