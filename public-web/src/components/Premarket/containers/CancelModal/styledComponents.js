/**
 * Owner: june.lee@kupotech.com
 */

import { Alert, Dialog, styled } from '@kux/mui';
import {
  themeBreakPointUpSM,
  themeColorComplementary,
  themeColorCover16,
  themeColorCover4,
  themeColorPrimary,
  themeColorText,
  themeColorText40,
  themeColorText60,
  themeFontLG,
  themeFontMD,
  themeFontX4L,
  themeFontX6L,
  themeFontXL,
  themeRadiusFull,
} from 'src/utils/themeSelector';

export const StyledInfoCardItem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  width: 100%;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  &.indented {
    ${themeBreakPointUpSM} {
      margin-bottom: 6px;
    }
    font-size: 13px;
    &:first-of-type {
      margin-top: 4px;
    }
  }
  .title {
    color: ${(props) => props.theme.colors.text40};
    text-decoration: underline;
    cursor: help;
    text-decoration-style: dashed;
    text-decoration-color: ${(props) => props.theme.colors.text20};
    text-underline-offset: 2px;
    &.noUnderline {
      text-decoration: unset;
      cursor: unset;
    }
    &.indented {
      position: relative;
      padding-left: 24px;
      &::before {
        position: absolute;
        bottom: 8px;
        left: 8px;
        width: 12px;
        height: 28px;
        border-bottom: 1px solid ${themeColorCover16};
        border-left: 1px solid ${themeColorCover16};
        content: '';
      }
      &.indentStart::before {
        height: 20px;
      }
      &.indentEnd::before {
        border-bottom-left-radius: 4px;
      }
    }
  }

  .info {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    &.indented {
      font-size: 13px;
    }
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  /* ${(props) => props.theme.breakpoints.up('sm')} {
    display: inline-flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    width: 25%;
    margin-bottom: 0;
    .title {
      margin-right: 0;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .value {
      font-size: 14px;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 25%;
    margin-bottom: 0;
    .title {
      margin-right: 8px;
      margin-bottom: 0;
      font-size: 14px;
    }

    .value {
      font-size: 14px;
    }
  } */
`;

export const StyledInfoCard = styled.div`
  padding: 16px;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 8px;

  .container {
    position: relative;
    .prefix-img {
      position: absolute;
      top: 20px;
      left: 5px;
    }
  }
`;

export const PledgeCompensateRatioSliderInputRoot = styled.div`
  .label {
    color: ${themeColorText40};
    font-weight: 400;
    text-align: center;
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-color: ${(props) => props.theme.colors.text20};
    text-underline-offset: 2px;
    ${themeFontLG};
  }
  .input-number-wrapper {
    margin-top: 4px;
    padding: 0 42px;
    .input-number {
      position: relative;
      .KuxInputNumber-input {
        color: ${themeColorPrimary};
        font-weight: 600;
        ${themeFontX6L};
      }
      // %号
      .KuxInputNumber-unit {
        position: absolute;
        top: 50%;
        right: 56px;
        color: ${themeColorPrimary};
        font-weight: 600;
        transform: translateY(-50%);
        ${themeFontX4L};
      }
      // +-号
      div:nth-child(3),
      div:nth-child(4) {
        top: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background-color: ${themeColorCover4};
        border-radius: ${themeRadiusFull};
        transform: translateY(-50%);
        svg {
          width: 16px;
          height: 16px;
        }
      }
      fieldset {
        border: none;
      }
    }
  }
  .slider-wrapper {
    width: 90%;
    margin: 25px auto;
  }
  /* .rc-slider-rail {
    background-color: ${themeColorCover4};
  }
  .rc-slider-track {
    background-color: ${themeColorPrimary};
  }
  .rc-slider-handle {
    border-color: ${themeColorPrimary};
    border-width: 4px;
  }
  .rc-slider-dot-active {
    border-color: ${themeColorPrimary};
  }
  .rc-slider-mark-text,
  .rc-slider-mark-text-active {
    color: ${themeColorText40};
    font-weight: 400;
    ${themeFontMD};
  } */
`;

export const StyledApplyCancelSucDialog = styled(Dialog)`
  .suc-img {
    display: flex;
    justify-content: center;
  }
  .title {
    color: ${themeColorText};
    font-weight: 700;
    text-align: center;
    ${themeFontX4L};
  }
  .message {
    margin-top: 8px;
    color: ${themeColorText60};
    font-weight: 400;
    text-align: center;
    ${themeFontXL};
  }
`;

export const StyledAlert = styled(Alert)`
  .KuxAlert-title {
    color: ${themeColorComplementary};
  }
`;

export const StyleReviewConfirmDialogText = styled.div`
  font-weight: 400;
  ${themeFontXL};
  color: ${themeColorText60};
`;

export const StyledDialogBodyWrapper = styled.div`
  margin: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${themeBreakPointUpSM} {
    margin: 0;
  }
`;
