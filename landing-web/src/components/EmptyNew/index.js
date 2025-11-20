/**
 * Owner: melon@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@kufox/mui/emotion';
import { ThemeProvider } from '@kufox/mui';
import { _t } from 'src/utils/lang';
import emptyLight_h5 from 'assets/global/empty-light.svg';

// style start
export const EmptyBox = styled.div`
  padding: 48px 16px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .Ku_land_empty_description {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-style: normal;
    line-height: 130%;
    text-align: center;
    ${(props) => props.theme.fonts.size.md};
  }
  .Ku_land_empty_sub_description {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-style: normal;
    line-height: 130%;
    text-align: center;
    ${(props) => props.theme.fonts.size.sm};
  }
  /* 中屏 大屏样式 */
  ${(props) => props.theme.breakpoints.up('md')} {
  }
`;
export const EmptyImg = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 8px;
  /* 中屏 大屏样式 */
  ${(props) => props.theme.breakpoints.up('md')} {
    width: 80px;
    height: 80px;
  }
`;
// style end

const Index = ({ subDescription, description, img, className }) => {
  return (
    <ThemeProvider>
      <EmptyBox className={className}>
        <EmptyImg className="Ku_land_empty_img" src={img} alt="empty" />
        {description ? <div className="Ku_land_empty_description">{description}</div> : ''}
        {subDescription ? (
          <div className="Ku_land_empty_sub_description">{subDescription}</div>
        ) : (
          ''
        )}
      </EmptyBox>
    </ThemeProvider>
  );
};

Index.propTypes = {
  img: PropTypes.any, // 图片
  description: PropTypes.any, //
  subDescription: PropTypes.any, //
  className: PropTypes.string, // 复写样式
};

Index.defaultProps = {
  img: emptyLight_h5,
  description: null,
  subDescription: null,
  className: '',
};

export default Index;
