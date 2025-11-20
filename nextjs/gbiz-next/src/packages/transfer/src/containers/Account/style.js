import { Global, Dropdown, styled, useTheme } from '@kux/mui';

import { ICArrowUpOutlined, ICSearchOutlined } from '@kux/icons';

export const ICSearch = styled(ICSearchOutlined)`
  fill: ${({ theme }) => theme.colors.icon60};
`;

export const StyledSubSelect = styled.div`
  padding: 12px 16px;
  .sub-select-header {
    display: flex;
    .sub-select-header-back {
      height: 28px;
      width: 28px;
      border-radius: 50%;
      border: 1px solid ${(props) => props.theme.colors.divider8};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        [dir='rtl'] & {
        transform: rotate(180deg);
      }
      }
      
    }
    .sub-select-header-title {
      ${(props) => props.theme.fonts.size.xl}
      color: ${(props) => props.theme.colors.text};
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }
  }
  .search-input {
    margin-top: 16px;
  }
  .sub-select-main {
    position: relative;
    max-height: 224px;
    margin-top: 8px;
    overflow-y: auto;
    .sub-option-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 56px;
      padding: 0;
      color: inherit;
      color: ${(props) => props.theme.colors.text};
      font: inherit;
      background: none;
      border: none;
      outline: inherit;
      cursor: pointer;
      ${(props) => props.theme.fonts.size.xl}
      &.actived, &:hover {
        background-color: ${(props) => props.theme.colors.cover2};
      }
      .sub-option-item-left {
        align-items: center;
        font-weight: 500;
        .base-currency {
        }
        .quote-currency {
          color: ${(props) => props.theme.colors.text40};
        }
      }
      .sub-option-item-right {
        ${(props) => props.theme.fonts.size.lg}
        .quote-currency {
          color: ${(props) => props.theme.colors.text40};
        }
      }
    }
    .empty-container {
      display: flex;
      justify-content: center;
    }
    .loading-container {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      .KuxSpin-root {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
`;

export const StyledOverlay = styled.div`
  background: ${(props) => props.theme.colors.layer};
  box-shadow: ${(props) =>
    props.theme.currentTheme === 'dark' ? 'none' : `0px 4px 40px ${props.theme.colors.cover4}`};
  border: 1px solid ${({ theme }) => theme.colors.cover4};
  border-radius: 8px;
  width: 100%;
  position: absolute;
  border-radius: 8px;
  top: 0px;
  left: 0;
  width: 100%;
  height: unset;
`;

export const StyledDropdown = styled(Dropdown)`
  width: 100%;
  cursor: pointer;
  .account-type-dropdown {
    width: 100%;
    transform: translate(0px, 38px) !important;
  }
  .KuxDropDown-trigger {
    width: 100%;
  }
  .account-input {
    width: 100%;
    > fieldset {
      border: 0;
    }
    &.disabled {
      cursor: not-allowed;
    }
  }
  .input {
    cursor: pointer;
    .KuxInput-suffix {
      margin-right: 0;
    }
    .KuxInput-input {
      padding-left: 4px;
      font-family: Kufox Sans;
      cursor: pointer;
    }
    .ICTriangleTop_svg__icon {
      transform: rotate(-180deg);
      transform-origin: center;
      transition: transform 0.3s;
      fill: ${(props) => props.theme.colors.text};
      &:hover {
        fill: ${(props) => props.theme.colors.text60};
      }
    }
    &.dropDownOpen {
      .ICTriangleTop_svg__icon {
        transform: none;
      }
    }
  }
`;

export const StyledTopSelect = styled.div`
  button {
    display: block;
    padding: 0;
    color: inherit;
    font: inherit;
    background: none;
    border: none;
    outline: inherit;
    cursor: pointer;
  }
  .top-gap {
    height: 8px;
    background-color: ${(props) =>
      props.theme.currentTheme === 'light'
        ? props.theme.colors.background
        : props.theme.colors.overlay};
  }
  .top-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    width: 100%;
    height: 56px;
    padding: 0 16px;
    &.actived,
    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
    .top-option-left {
      display: flex;
      align-items: center;
      span {
        margin-left: 16px;
        color: ${(props) => props.theme.colors.text};
        font-weight: 500;
      }
    }
    .arrow {
      [dir='rtl'] & {
        transform: rotate(180deg);
      }
    }
  }
`;

export const StyledAccountShow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  &.transition {
    transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
    transition-duration: 0.28s;
    transition-property: transform;
  }
  .prefix {
    flex: 0 0 18px;
    margin: 0 16px;
    line-height: 100%;
  }
  .label {
    flex: 1 1 auto;
    ${(props) => props.theme.fonts.size.xl}
    font-weight: 500;
    color: ${(props) => props.theme.colors.text};
  }
  .suffix {
    /* flex: 0 0 14px;
    margin-right: 8px; */
    position: absolute;
    right: 8px;
    width: 14px;
    top: 50%;
    transform: translateY(-50%);
  }
`;
