/**
 * Owner: tiger@kupotech.com
 */
import { Select, styled, Drawer } from '@kux/mui';
import {
  ICArrowUpOutlined,
  ErrorOutlined,
  ICSearchOutlined,
  ICCheckboxArrowOutlined,
} from '@kux/icons';

export const SelectWrapper = styled.div`
  display: flex;
`;
export const SelectStyle = styled(Select)`
  pointer-events: ${({ inApp }) => (inApp ? 'none' : 'unset')};
  .KuxSelect-wrapper {
    height: fit-content;
    & > div:first-of-type {
      position: static;
      min-height: 56px;
    }
  }
  .KuxSelect-itemLabel {
    white-space: normal;
    font-style: normal;
    line-height: 130%;
    padding: 15px 0;
    min-height: 56px;
    display: flex;
    align-items: center;
  }
`;
export const DownIcon = styled(ICArrowUpOutlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;
export const StyledDrawer = styled(Drawer)`
  border-radius: 16px 16px 0px 0px;
  height: calc(100vh - 56px);
  min-height: 200px;
  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 64px;
    height: 4px;
    border-radius: 2px;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.colors.textEmphasis};
  }
  .list {
    padding-top: 12px;
    padding-bottom: 20px;
    overflow-y: auto;
  }
  .groupLabel {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    padding: 0 13.5px 8px;
    color: ${({ theme }) => theme.colors.text40};
  }
  .item {
    padding: 13.5px 16px;
    white-space: normal;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
  }
  .itemActive {
    background-color: ${({ theme }) => theme.colors.cover2};
  }
  .emptyBox {
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
  }
`;
export const DrawerHeader = styled.section`
  padding: 24px 16px 16px;
  .headerTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
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
export const CloseIcon = styled(ErrorOutlined)`
  font-size: 24px;
  cursor: pointer;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.icon60};
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
