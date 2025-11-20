/**
 * Owner: solar.xia@kupotech.com
 */
import { Button, css, MDialog, styled } from '@kux/mui';
import { themeBreakPointUpSM, themeColorOverlay, themeColorText } from 'src/utils/themeSelector';

export const FlexBox = styled.div``;

export const BaseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-right: 24px;
    padding-left: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-right: 0;
    padding-left: 0;
  }
`;

export const NavTags = styled.ul`
  display: flex;
  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: space-between;
  }
  max-width: 100%;
  ${(props) => props.theme.fonts.size.md}
  color: rgba(243, 243, 243, 0.6); // 固定
  font-weight: 400;
  li {
    ${(props) =>
      props.omitTag &&
      css`
        min-width: 0;
        overflow: hidden;
        div {
          &:first-of-type {
            width: 100%;
          }
          &:nth-of-type(2) {
            width: 80%;
          }
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      `}
    display: flex;
    align-items: center;
    height: ${(props) => `${props.height || 20}px`};
    background-color: rgba(243, 243, 243, 0.08); ht: 8
    border-radius: 4px;
    cursor: pointer;
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-right: 8px;
      padding: 4px 10px;
    }
    & > *:not(:last-child) {
      margin-right: 6px;
    }

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      color: inherit !important;
      pointer-events: none;
      svg {
        ${(props) => props.theme.breakpoints.up('sm')} {
          margin-right: 4px;
        }
      }
    }
  }
`;
NavTags.defaultProps = {
  mode: 'light',
};

export const StyledBanner = styled.section`
  height: auto;
  background-color: #121212; // 颜色写死
  ${(props) => props.theme.breakpoints.up('sm')} {
    background-color: #1d1d1d;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    min-height: 420px;
  }
`;

export const StyledBannerContainer = styled(BaseContainer)`
  height: 100%;
  display: flex;
  position: relative;
  padding: 16px 16px 24px;
  ${(props) =>
    props.isInApp &&
    css`
      padding-top: 12px;
    `}
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 64px 24px 88px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 95px 0 116px;
  }
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background-image: ${(props) => (props.bgImg ? `url(${props.bgImg})` : 'none')};
    background-repeat: no-repeat;
    background-position: center;
    content: '';
    pointer-events: none;
  }

  .banner-icon {
    position: absolute;
    right: 0;
    bottom: 24px;
    z-index: 1;
    width: 120px;
    height: 120px;

    ${(props) => props.theme.breakpoints.up('sm')} {
      top: calc(50% - 25px);
      right: 24px;
      bottom: unset;
      width: 200px;
      height: 200px;
      transform: translateY(-50%);
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      right: 80px;
      width: 240px;
      height: 240px;
    }
  }

  article {
    z-index: 10;
    width: auto;
    ${(props) => props.theme.breakpoints.up('sm')} {
      width: 480px;
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      width: 720px;
    }
    h1 {
      color: #f3f3f3;
      font-weight: 600;
      font-style: normal;
      ${(props) => props.theme.fonts.size.x4l}
      ${(props) => props.theme.breakpoints.up('sm')} {
        width: 480px;
        font-weight: 700;
        ${(props) => props.theme.fonts.size.x6l}
      }
      ${(props) => props.theme.breakpoints.up('lg')} {
        width: 720px;
        ${(props) => props.theme.fonts.size.x6l}
      }
    }
    p {
      margin-top: 12px;
      color: rgba(243, 243, 243, 0.6);
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      ${(props) => props.theme.breakpoints.up('sm')} {
        color: rgba(243, 243, 243, 0.4);
        font-weight: 500;
        font-size: 16px;
      }
    }
    nav {
      margin-top: 32px;
    }
  }
  aside {
    img {
      margin-right: 80px;
    }
  }
`;

export const StyledH5Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    margin: 0;
    color: #f3f3f3;
    font-weight: 600;
    font-size: 24px;
    font-style: normal;
    line-height: 130%;
  }
  .right {
    width: 56px;
    height: 20px;
    color: #f3f3f3;
    .right-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: flex-end;
    }
  }
`;

export const StyledCardList = styled.section`
  ${themeBreakPointUpSM} {
    position: relative;
    margin-top: -40px;
    background-color: ${themeColorOverlay};
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
  }
`;

export const StyledMyOrderLink = styled(Button)`
  padding: 0 12px 0 10px;
  svg {
    width: 16px;
    height: 16px;
    color: ${(props) => props.theme.colors.text};
  }
  div.KuxButton-startIcon {
    margin-right: 8px;
  }
`;

export const StyledTypeTabs = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;

  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxTabs-Container {
      padding-top: 14px;
    }
  }
`;

export const SelectEmptyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;

  &.padding60 {
    padding-top: 60px;
  }
`;

export const StyledTabs = styled(BaseContainer)`
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  background: ${(props) => props.theme.colors.overlay};
  position: sticky;
  top: ${(props) => props.top}px;
  margin-bottom: 16px;
  ${(props) => props.theme.fonts.size.lg}
  display: flex;
  ${(props) => props.theme.breakpoints.up('sm')} {
    position: relative;
    top: unset;
    margin-bottom: 40px;
    background: unset;
    ${(props) => props.theme.fonts.size.x3l}
    padding-top: 32px;
  }
`;

export const CardListWrapper = styled(BaseContainer)`
  div.cardItem {
    margin-bottom: 16px;
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-bottom: 24px;
    }
  }
`;

export const PaginationWarpper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    justify-content: flex-end;
  }
`;

export const SelectWrapper = styled.div`
  margin: 0 0 16px;
  > div {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: -20px 0 24px;
    > div {
      width: 210px;
    }
  }
`;

export const FilterDialog = styled(MDialog)`
  min-height: 200px;
  padding-bottom: ${(props) => (props.isInApp ? '16px' : 0)};
`;

export const StyleSelectItem = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  padding: 0 12px 0 16px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text};
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.cover12};
  cursor: pointer;
`;

export const StyledFilteredInSm = styled.div``;

export const SelectOverlay = styled.div``;
export const SelectListWrapper = styled.div`
  /* height: 528px; */
  height: 468px;
  overflow-y: auto;
`;

export const SelectOptionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const SelectOptionItemText = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

export const SelectInputWrapper = styled.div`
  padding: 16px 16px 8px;
  .KuxInput-addonBefore {
    color: ${themeColorText};
  }
`;
