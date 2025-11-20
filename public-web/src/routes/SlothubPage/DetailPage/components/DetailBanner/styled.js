/*
 * @Date: 2024-05-27 17:20:12
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import { isChrome } from 'src/utils/judgeChrome';
import hotWrapBg from 'static/slothub/detail-banner-hot.svg';

export const Wrap = styled.section`
  background-color: ${({ theme }) => theme.colors.overlay};
  min-height: 407px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: auto;
    min-height: auto;
  }
`;

export const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  position: relative;
  padding-top: 60px;
  display: flex;
  flex: 1;
  justify-content: space-between;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 40px 24px 0px;
    overflow: hidden;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 16px 0px;
    overflow: unset;
  }
`;

export const BannerTextWrap = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 79px;
  position: relative;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    margin-bottom: 128px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
  }
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
  position: relative;
  max-width: 720px;
  z-index: 2;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(100vw - 150px);
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: calc(100vw - 100px);
    margin-bottom: 4px;
    font-size: 24px;
  }

  .highlight {
    color: #d3f475;
  }
`;

export const GreenText = styled.span`
  color: #d3f475;
`;

export const LeftBg = styled.img`
  position: absolute;
  left: -170px;
  top: -60px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    left: -24px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: -20px;
    left: -16px;
  }
`;

export const RightBg = styled.img`
  position: absolute;
  right: 0;
  top: 50%;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    right: -70px;
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    transform: translateY(-50%);
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: 100px;
    right: -16px;
  }
`;

export const DescText = styled.span`
  color: ${({ theme }) => theme.colors.text40};
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 20px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    font-size: 14px;
  }

  .highlight {
    color: #d3f475;
  }
`;

export const DescTimeText = styled.p`
  color: ${({ theme }) => theme.colors.text40};
  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  padding: 2px 4px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.cover4};
  width: max-content;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 500;
    font-size: 11px;
  }
`;

export const OuterContentWrap = styled.div`
  position: relative;

  ${({ theme }) => theme.breakpoints.up('lg')} {
    margin-top: 50px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    right: -16px;
    width: 114px;
    overflow: hidden;
  }
`;

export const PadBottomCardWrap = styled.section`
  max-width: 720px;
  width: 100%;
  position: absolute;
  bottom: -89px;
  z-index: 99;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    position: relative;
    bottom: 0;
    margin-bottom: 16px;
    padding-bottom: 20px;
  }
`;

export const HotAmount = styled.div`
  display: inline-flex;
  vertical-align: top;
  margin-top: -6px;
  align-items: center;
  width: 0;
  height: 25.5px;
  .inner-wrap {
    padding-bottom: 3.5px;
    background: url(${hotWrapBg});
    background-repeat: no-repeat;
    background-size: auto 100%;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding-bottom: 2.5px;
    }
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: ${({ isRTL }) => (isRTL ? '-9px' : '-3px')};
  }
  section {
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;
    padding: 0 4px;
    background-color: #f65454;
    border-radius: 16px;
    .hot-icon {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }

    span {
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      line-height: 130%;
    }
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 0;
    height: 17.54px;

    section {
      padding: 0 2px;
      border-radius: 10px;
      .hot-icon {
        width: 12px;
        height: 12px;
        margin-right: 2px;
      }
      span {
        font-size: ${isChrome ? '12px' : '10px'};
        zoom: ${isChrome ? 0.83 : 'unset'};
      }
    }
  }
`;

export const BreadCrumbWrap = styled.section`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  z-index: 99;

  span {
    color: rgba(243, 243, 243, 0.4);
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
  }

  .home {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .highlight {
    color: #f3f3f3;
  }
  .gap {
    margin: 0 8px;
  }
`;
