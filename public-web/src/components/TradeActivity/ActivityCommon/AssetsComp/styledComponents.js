/**
 * Owner: jessie@kupotech.com
 */
import { MDialog, styled } from '@kux/mui';

export const PoolAvailableWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .leftWrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-right: 2px;
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;

    .KuxDropDown-popper {
      z-index: 10 !important;
    }
    .label {
      margin-right: 2px;
      color: ${(props) => props.theme.colors.text40};
    }
    .value {
      margin-right: 2px;
      color: ${(props) => props.theme.colors.text};
    }
    .icon {
      position: relative;
      width: 16px;
      height: 16px;
      color: ${(props) => props.theme.colors.textPrimary};
      text-align: center;
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
  .operatorWrapper {
    display: none;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .leftWrapper {
      margin-top: -2px;
      margin-right: 2px;
      .icon {
        display: none;
        &.miniIcon {
          display: block;
        }
      }
    }
    .operatorWrapper {
      display: flex;
      align-items: center;
      margin-left: 24px;

      > span {
        color: ${(props) => props.theme.colors.textPrimary};
        font-weight: 400;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;
        cursor: pointer;
      }
      &.miniOperatorWrapper {
        display: none;
      }
    }
  }
`;

export const StyledDropDownOption = styled.div`
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  min-width: 186px;
  background-color: ${(props) => props.theme.colors.layer};
  button.create-option {
    ${(props) => props.theme.fonts.size.lg}
    padding: 0 16px;
    width: 100%;
    height: 56px;
    color: ${(props) => props.theme.colors.text};
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
    /* &:nth-of-type(2n) {
      width: 100%;
      
    } */
  }
`;

export const AssetBtnWrapper = styled.span`
  cursor: pointer;
`;

export const FilterDialog = styled(MDialog)`
  min-height: auto;
  .KuxModalFooter-root {
    padding: 12px 16px 46px;
  }
`;

export const StyledDropDownH5Option = styled.div`
  background-color: ${(props) => props.theme.colors.layer};
  border-radius: 16px 16px 0px 0px;
  padding-top: 12px;
  button.create-option {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
  }
`;
