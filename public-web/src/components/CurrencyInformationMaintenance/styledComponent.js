/**
 * Owner: solarxia@kupotech.com
 */
import { css, Input, styled, Table } from '@kux/mui';
import bannerBg from 'static/currencyInformationMaintenance/banner-bg.svg';

export const StyledCurrencyInfomationMaintenance = styled.div`
  background-color: ${(props) => props.theme.colors.overlay};
  min-height: 80vh;
  // min-width: 375px;
  width: 100%;
`;

export const StyledBanner = styled.div`
  height: auto;
  background-image: url(${bannerBg});
  background-repeat: no-repeat;
  background-position: right center;
  background-color: ${(props) => props.theme.colors.cover4};
  padding-bottom: 56px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    height: 420px;
    padding-bottom: 0px;
  }
`;
export const StyledTable = styled(Table)`
  td {
    padding: 20px 0 !important;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    thead {
      display: none;
    }
  }
`;
const BaseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0;
  }
`;
export const StyledBannerContainer = styled(BaseContainer)`
  display: flex;
  justify-content: space-between;
  ${(props) => props.theme.breakpoints.up('sm')} {
    align-items: center;
    height: 100%;
  }
  article {
    width: 720px;
    transform: translateY(-12px);
    ${(props) => props.theme.breakpoints.up('lg')} {
      transform: translateY(-20px);
    }

    h1 {
      margin-top: 32px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 24px;
      font-style: normal;
      line-height: 130%;
      ${(props) => props.theme.breakpoints.up('sm')} {
        margin-top: 0;
        font-size: 36px;
      }
    }
    p {
      &:first-of-type {
        margin-top: 12px;
        ${(props) => props.theme.breakpoints.up('sm')} {
          margin-top: 20px;
        }
      }
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      ${(props) => props.theme.breakpoints.up('sm')} {
        font-size: 16px;
      }
    }
  }
  aside {
    transform: translateY(-12px);
    ${(props) => props.theme.breakpoints.up('lg')} {
      transform: translateY(-20px);
    }
    img {
      ${(props) => props.theme.breakpoints.up('sm')} {
        width: 160px;
        height: 160px;
      }
      ${(props) => props.theme.breakpoints.up('lg')} {
        width: 240px;
        height: 240px;
      }
    }
  }
`;
export const StyledMain = styled.div`
  position: relative;
  margin-top: -24px;
  padding-top: 12px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${(props) => props.theme.colors.overlay};

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-top: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: -40px;
    padding-top: 40px;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
  }
`;
export const StyledAlert = styled.div`
  position: relative;
  div {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding-left: 8px;
    color: ${(props) => props.theme.colors.primary};
    line-height: 21px;
    background: ${(props) => props.theme.colors.overlay};
    cursor: pointer;
    &:before {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      background: ${(props) => props.theme.colors.complementary8};
      content: '';
    }
  }

  ul {
    ${(props) => {
      return props.isExpand
        ? css`
            max-height: none;
            overflow: auto;
          `
        : css`
            max-height: 63px;
            overflow: hidden;
          `;
    }}
    padding-left: 17px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 150%;
    list-style-type: disc;
  }
`;
export const StyledMainContainer = styled(BaseContainer)``;
export const StyledTableWrapper = styled.div`
  /* margin-top: 12px; */
  padding-bottom: 40px;
  th {
    vertical-align: middle;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 32px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 40px;
  }
`;
export const StyledEmptyText = styled.div`
  img {
  }
  span {
    margin-top: 8px;
    text-align: center;
  }
`;
export const StyledNameCol = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
    margin-right: 16px;
    border-radius: 50%;
  }
  .nameContainer {
    display: flex;
    align-items: center;
    .baseCurrencyName {
      margin-right: 8px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 18px;
      font-style: normal;
      line-height: 130%;
    }
    .baseCurrency {
      flex-direction: row;
      align-items: center;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      flex-direction: column;
      align-items: flex-start;
      .baseCurrency {
        margin-top: 2px;
      }
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      flex-direction: row;
      align-items: center;
    }
  }
`;
export const StyledSearch = styled(Input)`
  width: 100% !important;
  height: 40px;
  margin-top: 16px;
  color: ${(props) => props.theme.colors.text40};
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 187px !important;
    margin-top: 0;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 268px !important;
    margin-top: 0;
  }
`;

export const StyledSmTime = styled.div`
  .row {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
    line-height: 130%;
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 16px;
    }
    &:first-of-type {
      margin-top: 12px;
    }
    .col {
      &:first-of-type {
        color: ${(props) => props.theme.colors.text40};
      }
      &:last-of-type {
        color: ${(props) => props.theme.colors.text};
        text-align: right;
      }
    }
  }
`;
