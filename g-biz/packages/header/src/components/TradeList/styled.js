/**
 * Owner: roger@kupotech.com
 */
import { styled, Dropdown as CusDropdown } from '@kux/mui';
import { fade, blendColors } from '@kux/mui/utils/colorManipulator';

const Wrapper = styled.div`
  min-width: 316px;
  position: relative;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 0px 16px 16px 0px;
  box-shadow: 35px -20px 45px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px -8px rgba(0, 0, 0, 0.05);
  [dir='rtl'] & {
    border-radius: 16px 0 0 16px;
  }
`;

const Container = styled.div`
  background: ${(props) =>
    blendColors(props.theme.colors.textEmphasis, fade(props.theme.colors.cover, 0.02))};
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  border-radius: 0px 16px 16px 0px;
  [dir='rtl'] & {
    border-radius: 16px 0 0 16px;
  }
`;

const TradeListBlank1 = styled.div`
  position: absolute;
  left: -26px;
  bottom: 0px;
  width: 26px;
  height: 12px;
  background: ${(props) => props.theme.colors.layer};
  [dir='rtl'] & {
    left: unset;
    right: -26px;
    background: ${(props) =>
      blendColors(props.theme.colors.textEmphasis, fade(props.theme.colors.cover, 0.02))};
  }
`;

const TradeListBlank2 = styled(TradeListBlank1)`
  top: 0px;
`;

const SearchWrapper = styled.div`
  min-width: 268px;
  flex-shrink: 0;
  padding-bottom: 12px;
  margin: 0 24px;
  .KuxInput-prefix {
    opacity: 0.4;
    [dir='rtl'] & {
      margin-right: unset !important;
      margin-left: 4px !important;
    }
  }
  .KuxInput-clearIcon {
    svg {
      color: ${(props) => props.theme.colors.icon};
      opacity: 0.4;
    }
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const Tabs = styled.div`
  min-width: 268px;
  height: 24px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin: 8px 24px 12px;
  .KuxDropDown-popper {
    inset: 20px 0px auto -60px !important;
    transform: unset !important;
    [dir='rtl'] & {
      inset: 20px -60px auto 0px !important;
    }
  }
  > div {
    position: relative;
  }
`;
const Tab = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  height: 100%;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text40};
  margin-right: 16px;
`;

const ActiveTab = styled(Tab)`
  color: ${(props) => props.theme.colors.text};
  position: relative;
  :after {
    content: '';
    height: 4px;
    bottom: 0px;
    width: 100%;
    max-width: 24px;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    background: ${(props) => props.theme.colors.primary};
    border-radius: 4px;
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
  }
`;

const BottomCursor = styled.span`
  height: 4px;
  bottom: 0px;
  width: 100%;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background: ${(props) => props.theme.colors.primary};
  border-radius: 4px;
  position: absolute;
`;

const TabMore = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  height: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text40};
  position: relative;
  padding-right: 13px;
  & .arrowIcon {
    position: absolute;
    top: 1px;
    right: 1px;
  }
  &:hover .arrowIcon {
    transform: rotate(180deg);
    top: 4px;
  }
  &:svg {
    width: 10px;
    margin-left: 1px;
  }
`;
const ActiveTabMore = styled(TabMore)`
  color: ${(props) => props.theme.colors.text};
  position: relative;
  :after {
    content: '';
    height: 4px;
    bottom: 0px;
    width: 24px;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    background: ${(props) => props.theme.colors.primary};
    border-radius: 4px;
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    margin-left: -6px;
  }
`;

const TabMoreList = styled.div`
  min-width: 81px;
  overflow: auto;
  &::-webkit-scrollbar {
    background: transparent;
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: ${(props) => props.theme.colors.cover8};
  }
`;
const TabMoreItem = styled.div`
  font-weight: 400;
  font-size: 14px;
  padding: 9px 12px;
  color: #fff;
  cursor: pointer;
  line-height: 22px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  :hover {
    background: rgba(243, 243, 243, 0.02);
  }
`;
const ActiveTabMoreItem = styled.div`
  font-weight: 400;
  font-size: 14px;
  padding: 9px 12px;
  color: #ffffff;
  background: rgba(243, 243, 243, 0.02);
  cursor: pointer;
  line-height: 22px;
`;

const ListWrapper = styled.div`
  width: 100%;
  flex: 1;
`;

const Dropdown = styled(CusDropdown)`
  .KuxDropDown-open {
    background: ${(props) => props.theme.colors.tip};
    border-radius: 8px;
  }
`;

export {
  Wrapper,
  Container,
  SearchWrapper,
  ListWrapper,
  Tabs,
  Tab,
  ActiveTab,
  ContentWrapper,
  TabMore,
  ActiveTabMore,
  TabMoreList,
  TabMoreItem,
  ActiveTabMoreItem,
  BottomCursor,
  TradeListBlank1,
  TradeListBlank2,
  Dropdown,
};
