/**
 * Owner: tiger@kupotech.com
 */
import { Select, styled, Drawer } from '@kux/mui';
import {
  ICArrowUpOutlined,
  ICCloseOutlined,
  ICSearchOutlined,
  ICCheckboxArrowOutlined,
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
    color: ${(props) => props.theme.colors.text60};
  }
  &.isFocus {
    .KuxSelect-itemLabel {
      padding-left: 4px;
      .countryItemIcon {
        display: none;
      }
    }
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
export const ExtraLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 24px;
  margin-top: 16px;
  color: ${(props) => props.theme.colors.text};
`;
export const DownIcon = styled(ICArrowUpOutlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

export const StyledDrawer = styled(Drawer)`
  width: 100vw;
  .list {
    padding-bottom: 20px;
    overflow-y: auto;
  }
  .countryItem {
    min-height: 48px;
    padding: 10px 16px;
    cursor: pointer;
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
    color: ${({ theme }) => theme.colors.text};
  }
  fieldset {
    border-radius: 20px;
  }
`;
export const CloseIcon = styled(ICCloseOutlined)`
  font-size: 24px;
  cursor: pointer;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text};
`;
export const SearchIcon = styled(ICSearchOutlined)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.icon40};
`;
export const ActiveIcon = styled(ICCheckboxArrowOutlined)`
  flex-shrink: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;
