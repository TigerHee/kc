/**
 * Owner: tiger@kupotech.com
 */
import { Select, styled, Drawer } from '@kux/mui';
import {
  ICCloseOutlined,
  ICSearchOutlined,
  ICCheckboxArrowOutlined,
  ICSuccessUnselectOutlined,
  ICSuccessFilled,
  ICHookOutlined,
} from '@kux/icons';

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .tip {
    display: inline-flex;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-top: 4px;
    color: var(--color-text60);
  }
  .KuxSelect-wrapper {
    .selectIcon {
      display: none;
    }
  }
  &.isFocus {
    .KuxSelect-itemLabel {
      padding-left: 4px;
      .countryItemIcon {
        display: none;
      }
    }
  }
  &.isMultiChoice {
    .KuxSelect-wrapper {
      min-height: 56px;
      padding: 12px 32px 12px 12px;
      input {
        height: 30px !important;
      }
    }
  }
  &.isinApp {
    .KuxSelect-wrapper {
      & > div:first-of-type svg {
        display: none;
      }
      input {
        display: none;
        &::placeholder {
          font-size: 12px;
        }
      }
    }
  }
  &.disabled {
    cursor: not-allowed;
  }
`;
export const SelectStyle = styled(Select)`
  pointer-events: ${({ inApp }) => (inApp ? 'none' : 'unset')};
  .KuxSelect-itemLabel {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .KuxSelect-icon {
    font-size: 0;
  }
`;

export const StyledDrawer = styled(Drawer)`
  width: 100vw;
  .KuxDrawer-content {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .drawerContent {
    flex: 1;
    width: 100%;
    overflow-y: auto;
  }
  .list {
    width: 100%;
    padding-bottom: 20px;
  }
  .listItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 53px;
    padding: 10px 16px;
  }
  .countryItem {
  }
  .selectIcon {
    display: none;
  }
  .emptyBox {
    display: flex;
    justify-content: center;
  }
`;
export const DrawerHeader = styled.section`
  padding: 44px 16px 8px;
  .headerTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 44px;
    margin-bottom: 16px;
  }
  .headerTitle {
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    color: var(--color-text);
  }
  fieldset {
    border-radius: 20px;
  }
`;
export const CloseIcon = styled(ICCloseOutlined)`
  font-size: 24px;
  cursor: pointer;
  flex-shrink: 0;
  color: var(--color-text);
`;
export const SearchIcon = styled(ICSearchOutlined)`
  font-size: 20px;
  color: var(--color-icon40);
`;
export const ActiveIcon = styled(ICCheckboxArrowOutlined)`
  flex-shrink: 0;
  font-size: 20px;
  color: var(--color-text);
`;
export const CheckIcon = styled(ICSuccessFilled)`
  font-size: 24px;
  color: var(--color-text);
`;
export const UncheckIcon = styled(ICSuccessUnselectOutlined)`
  font-size: 24px;
  color: var(--color-icon40);
`;
export const SelectIcon = styled(ICHookOutlined)`
  font-size: 16px;
  color: var(--color-text);
`;
