import { Drawer, styled } from '@kux/mui';
import Link from '../../components/Link';

export const HeaderClose = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  position: absolute;
  right: 32px;
  top: 23px;
  border: 2px solid ${(props) => props.theme.colors.cover8};
  z-index: ${(props) => props.theme.zIndices.modal};
  border-radius: 100%;
  cursor: pointer;
  ${(props) => props.theme.breakpoints.down('sm')} {
    right: 18px;
  }
  [dir='rtl'] & {
    right: auto;
    left: 32px;
  }
`;

export const DrawerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

export const DrawerHeaderWrapper = styled.div`
  height: 80px;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  & .navLinks {
    margin-top: 12px;
    & .rc-collapse {
      background: ${(props) => props.theme.colors.overlay} !important;
    }
  }
  .userBox2 {
    margin-top: 2px;
    margin-bottom: 20px;
  }
`;

export const ScrollContent = styled.div`
  width: 100%;
  padding: 0 20px 100px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 12px 160px;
  }
`;

export const CusDrawer = styled(Drawer)`
  max-width: 400px;
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding: 0 !important;
  background-color: ${(props) => props.colors.layer};
  .KuxDrawer-content {
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: ${(props) => props.theme.colors.cover8};
    }
  }
  & .showDownBox {
    padding: 0 24px;
  }
  & .userBox {
    margin: 0;
  }
`;

export const Hr = styled.hr`
  height: 1px;
  background: ${(props) => props.theme.colors.divider4};
  margin: 8px 12px 12px;
  border: none;
`;

export const Hr2 = styled(Hr)`
  margin: 12px;
`;

export const Hr3 = styled(Hr)`
  margin: 0 32px 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0 16px 0;
  }
`;

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  height: 56px;
  line-height: 56px;
  cursor: pointer;
  color: ${(props) => props.colors.text};
  font-weight: 500;
  padding: 0 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 6px;
  }
  border-radius: 8px;
  &:hover {
    background: ${(props) => props.colors.cover2};
  }
`;

export const I18nItem = styled(Item)`
  margin-bottom: 12px;
`;

export const ThemeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 6px;
  }
  &:hover {
    background: unset;
  }
`;

export const CusLink = styled(Link)`
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.colors.text};
  text-decoration: none;
  display: flex;
  align-items: center;
  &:hover {
    color: ${(props) => props.colors.text};
  }
  & span {
    margin: 0 0 0 8px;
    [dir='rtl'] & {
      margin: 0 8px 0 0;
    }
  }
`;

export const ItemValue = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.colors.text40};
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  & svg {
    margin-right: 8px;
    [dir='rtl'] & {
      margin-right: 0;
      margin-left: 8px;
    }
  }
`;
