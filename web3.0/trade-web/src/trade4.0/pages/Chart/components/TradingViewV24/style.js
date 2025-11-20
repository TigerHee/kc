/**
 * Owner: borden@kupotech.com
 */
import { styled, fx, withMedia } from '@/style/emotion';
import { name } from '@/pages/Chart/config';
import dropStyle from '@/components/DropdownSelect/style';
import SvgComponent from '@/components/SvgComponent';
import Dialog from '@mui/Dialog';
import ScrollWrapper from '@/components/ScrollWrapper';

const HOC = (FC) => withMedia(name, FC);

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .spin {
    width: 100%;
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme?.colors?.overlay};

    &.disabled {
      display: none;
    }
  }
`;
export const TVWrapper = HOC(styled.div`
  width: 100%;
  height: ${(props) => (props.full ? '100%' : 'calc(100% - 33px)')};

  > div {
    width: 100%;
    height: 100%;
  }

  ${({ $media }) => $media('sm', 'height: 100%')}
`);

// header
export const HeaderWrapper = HOC(styled(ScrollWrapper)`
  ${fx.alignItems('center')}
  ${fx.padding('8px 12px')}
  ${fx.height(32)}
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};
  justify-content: space-between;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  display: ${(props) => (props.hidden ? 'none' : 'flex')};
  ${({ $media }) => $media('sm', 'display: none')}
`);

export const Left = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
`;

export const Right = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
`;

// k线自定义bar 左侧item
export const TextItem = styled.span`
  ${fx.display('inline-flex')}
  margin-right: 12px;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text60};

  &:hover {
    color: ${(props) => props.theme.colors.text};
  }

  &.active {
    color: ${(props) => props.theme.colors.textPrimary} !important;
    svg {
      color: ${(props) => props.theme.colors.textPrimary} !important;
    }
  }
  &.value-data {
    color: ${(props) => props.theme.colors.textPrimary} !important;
    svg {
      color: ${(props) => props.theme.colors.textPrimary} !important;
    }
  }
`;

// k线自定义bar icon
export const HeaderIconItem = styled.span`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  margin-left: 16px;
  cursor: pointer;

  &.ml-4 {
    margin-left: 4px;
  }
`;
export const HeaderIcon = styled(SvgComponent)`
  color: ${(props) => props.theme.colors.icon};
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

export const IntervalWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  margin-right: 16px;

  > div {
    display: inline-flex !important;
  }
  & > span:last-of-type {
    margin-right: 0;
  }
`;

export const DropdownExtend = {
  Icon: styled(dropStyle.Icon)`
    color: ${({ theme }) => {
      return theme.colors.icon;
    }};
  `,
  Text: styled(dropStyle.Text)`
    padding: 0 2px 0 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.colors.textPrimary};
  `,
  List: styled(dropStyle.List)`
    max-height: 300px;
    overflow-y: auto;
    font-size: 14px;
    & .dropdown-value {
      padding: 0 2px 0 0;
    }
  `,
};

export const StudyModalWrapper = styled(Dialog)`
  width: 100%;

  .KuxDialog-body {
    height: 640px;
    max-height: 90%;
  }

  .KuxDialog-content {
    flex: 1;
    padding: 0;
    height: calc(100% - 100px);
    overflow: hidden;
  }

  &.KuxMDrawer-root {
    height: 90% !important;
    .KuxModalHeader-root {
      min-height: 56px;
    }

    .KuxMDialog-content {
      padding: 12px 0 0;
    }
  }
`;

export const SearchBar = styled.div`
  width: 100%;
  padding: 0 32px;

  .KuxInput-root {
    border-radius: 30px;
  }
  fieldset {
    border-radius: 30px;
  }
  input {
    padding: 0 0 0 2px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 12px;
  }
`;

export const ListContent = styled.div`
  width: 100%;
  height: calc(100% - 62px);
`;

export const TabsBar = styled.div`
  width: 100%;
  margin-top: 8px;
  height: 48px;

  .KuxTabs-container {
    padding: 0 32px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxTabs-container {
      padding: 0 12px;
    }
  }

  ${(props) =>
    props.theme.currentTheme === 'dark' &&
    `
      .KuxTabs-rightScrollButtonBg {
    background: none;
      }
      .KuxTabs-leftScrollButtonBg {
    background: none;
      }
     `}
`;

export const StudyList = styled.div`
  width: 100%;
  padding: 0 32px;
  margin-top: 21px;
  height: calc(100% - 56px);
  overflow: auto;
  &.full-list {
    height: 100%;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 12px;
  }
`;
export const StudyItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 26px;

  svg {
    margin-right: 12px;
    color: ${({ theme }) => {
      return theme.colors.icon;
    }};
    &.active-icon {
      color: ${({ theme }) => {
        return theme.colors.complementary;
      }};
    }
  }
`;

export const StudyText = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => {
    return theme.colors.text;
  }};

  &.active {
    color: ${({ theme }) => {
      return theme.colors.textPrimary;
    }};
  }

  svg {
    color: ${({ theme }) => {
      return theme.colors.textPrimary;
    }};
  }
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;

  svg {
    margin-left: 16px;
    color: ${(props) => props.theme.colors.icon};
    &.active-icon {
      color: ${(props) => props.theme.colors.complementary};
    }
  }
`;

export const IconSelectName = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
`;

export const IconSelectIcon = styled(SvgComponent)`
  margin-right: 8px;
  margin-left: 0 !important;
  color: ${(props) => props.theme.colors.icon};
`;

export const IconSelectValue = styled(SvgComponent)`
  margin: 0;
  color: ${(props) => props.theme.colors.icon};
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

export const OverlayWrapper = styled.div`
  overflow: hidden;
  background: ${(props) => props.theme.colors.layer};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  & .dropdown-item {
    padding: 10px 16px;
    min-width: 80px;
    color: ${({ theme }) => {
      return theme.colors.text;
    }};
    cursor: pointer;
    &:hover {
      background: ${(props) => props.theme.colors.cover4};
    }

    // 组件库阿拉伯语下有问题
    .KuxCheckbox-wrapper {
      >span:last-of-type {
        margin-left: 6px !important;
        margin-right: unset !important;
      }
    }
  }
`;
