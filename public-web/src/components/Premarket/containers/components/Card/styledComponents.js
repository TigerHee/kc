/**
 * Owner: solar.xia@kupotech.com
 */
import { css, styled } from '@kux/mui';
import {
  themeBreakPointDownSM,
  themeBreakPointUpLG,
  themeBreakPointUpSM,
  themeColorCover4,
  themeColorDivider8,
  themeColorIcon,
  themeColorText,
  themeColorText40,
  themeColorText60,
  themeFontMD,
  themeFontX2L,
  themeFontX3L,
  themeFontX5L,
  themeFontXL,
} from 'src/utils/themeSelector';
import { BaseContainer } from '../../../styledComponents';
export const StyledCard = styled(BaseContainer)`
  display: flex;
  flex-direction: column;
  padding: 20px 16px 16px;
  gap: 16px;
  background: ${(props) => props.theme.colors.cover2};

  .top-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 100%;
  }

  .currency-detail {
    display: flex;
    align-items: center;
    align-self: stretch;
  }
  .supply-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    align-self: stretch;
    width: 100%;

    .supply-item {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      font-size: 13px;
      line-height: 130%; /* 16.9px */
      font-feature-settings: 'liga' off, 'clig' off;
      .label {
        color: ${themeColorText40};
        font-weight: 400;
      }
      .value {
        color: ${themeColorText};
        font-weight: 400;
      }
    }
  }
  .trade-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    width: 100%;
    .trade-info-item {
      display: flex;
      align-items: flex-start;
      align-self: stretch;
      justify-content: space-between;
      width: 100%;
      font-size: 13px;
      line-height: 130%; /* 16.9px */
      .label {
        color: ${themeColorText40};
        font-weight: 400;
      }
      .value {
        color: ${themeColorText};
        font-weight: 500;
        text-align: right;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    gap: 24px;
    padding: 24px 0 32px;
    background: transparent;
    .supply-info {
      flex-direction: column;
      gap: 16px;
      width: 348px;
      margin-top: 8px;
      .supply-item {
        flex-direction: row;
        gap: 6px;
        justify-content: flex-start;
        .value {
          font-weight: 500;
          font-size: 15px;
        }
      }
    }
    .trade-info {
      padding: 16px;
      background: ${themeColorCover4};
      border-radius: 12px;
    }
    .top-info {
      flex-direction: row;
      gap: 24px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: row;
    justify-content: space-between;
    padding: 40px 0;
    .trade-info {
      width: 480px;
    }
  }
`;
export const NavTags = styled.ul`
  display: flex;
  max-width: 100%;
  ${(props) => props.theme.fonts.size.md}
  color: ${(props) => props.theme.colors.text};
  font-weight: 400;
  li {
    ${(props) =>
      props.omitTag &&
      css`
        min-width: 0;
        overflow: hidden;
        /* &:first-of-type {
          flex: 1;
        }
        &:nth-of-type(2) {
          flex: 1;
          padding-left: 24px;
          img {
            margin-left: -10px;
          }
        } */
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
    margin-right: 8px;
    padding: 4px 10px;
    background-color: ${(props) => props.theme.colors.cover4};
    border-radius: 4px;
    cursor: pointer;
    & > *:not(:last-child) {
      margin-right: 6px;
    }
    img {
      cursor: pointer;
    }
  }
`;
NavTags.defaultProps = {
  mode: 'light',
};
export const StyledCardSection = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  flex: 1 0 0;
  gap: 8px;
  & > img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }
  .title-container {
    position: relative;
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    .title-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
      width: 100%;
      .shortName {
        margin-bottom: 0;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        ${themeFontX2L}
        ${themeBreakPointUpSM} {
          ${themeFontX3L}
        }
        ${themeBreakPointUpLG} {
          ${themeFontX5L}
        }
      }
      .fullName {
        margin-bottom: 0;
        overflow: hidden;
        color: ${themeColorText40};
        font-weight: 400;
        white-space: nowrap;
        text-overflow: ellipsis;
        ${themeFontMD};
        ${themeBreakPointUpLG} {
          ${themeFontXL}
        }
      }

      .nameInfo {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .tag {
      }

      ${themeBreakPointUpSM} {
        flex-direction: row;
        gap: 6px;
        align-items: center;
      }
    }
    .action-buttons {
      position: absolute;
      right: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 12px;
      margin-inline-start: auto;
      ${themeBreakPointDownSM} {
        right: 0;
      }
      ${themeBreakPointUpSM} {
        top: 50%;
        right: 0;
        gap: 8px;
        justify-content: flex-start;
        margin-top: 0;
        transform: translateY(-50%);
        margin-inline-start: 0;
      }
      ${themeBreakPointUpLG} {
        position: static;
        gap: 8px;
        justify-content: flex-start;
        margin-top: 0;
        transform: unset;
        margin-inline-start: 0;
      }
      .action-button {
        align-items: center;

        color: ${themeColorText60};
        font-weight: 400;
        line-height: 1;
        border-color: ${themeColorDivider8};
        ${themeBreakPointUpSM} {
          height: 30px;
          padding-right: 16px;
          padding-left: 16px;
        }
        ${themeFontMD};
        .KuxButton-startIcon {
          width: 12px;
          height: 12px;
          margin-inline-end: 2px;
        }
      }
      .share-btn {
        ${themeBreakPointDownSM} {
          padding: 0;
          color: ${themeColorIcon};
          .KuxButton-startIcon {
            width: 16px;
            height: 16px;
            margin-inline-end: 0;
          }
        }
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    gap: 16px;
    width: auto;
    & > img {
      width: 64px;
      height: 64px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    & > img {
      width: 80px;
      height: 80px;
    }
  }
`;
export const StyledCardSectionModal = styled.div`
  padding: 16px;
  /* min-width: 375px; */
  position: relative;
  height: 100%;
  .KuxButton-root {
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% - 32px);
    margin: 24px 16px 16px;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;
  }
  main {
    position: relative;
    margin-top: 16px;
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-top: 20px;
    }
    p {
      ${(props) => {
        return (
          !props.expanded &&
          css`
            height: 42px;
          `
        );
      }}
      overflow: hidden;
      color: ${(props) => props.theme.colors.text60};
      font-size: 14px;
      line-height: 150%;
    }
    .more {
      position: absolute;
      right: 0;
      bottom: 0;
      padding-left: 4px;
      color: #01bc8d;
      font-size: 14px;
      line-height: 150%;
      background-color: ${(props) => props.theme.colors.overlay};
      cursor: pointer;
      &:after {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(1, 188, 53, 0.02);
        background: ${(props) => props.theme.colors.primary2};
        content: '';
      }
    }
  }
`;
export const StyledToolTipContent = styled.span`
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: ${(props) => props.theme.colors.text20};
  text-underline-offset: 2px;
  cursor: help;
`;

export const StyledFeeDialogBody = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  .item {
    display: flex;
    align-items: center;
    align-self: stretch;
    justify-content: space-between;
    font-size: 16px;
    line-height: 150%; /* 24px */
    .label {
      color: ${themeColorText60};
      font-weight: 400;
    }
    .value {
      color: ${themeColorText};
      font-weight: 500;
    }
  }
`;
