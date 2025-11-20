/**
 * Owner: larvide.peng@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import MuiDrawer from 'routes/SlothubPage/components/mui/Drawer';

export const MuiDrawerStyle = styled(MuiDrawer)`
  min-width: auto;
  * {
    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.colors.cover8};
      border-radius: 2px;
    }
  }
  .KuxModalHeader-close {
    ${(props) => props.theme.breakpoints.down('sm')} {
      display: none;
    }
  }
  .KuxDrawer-HeaderBg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 78px;
    background: linear-gradient(to bottom, rgba(26, 226, 154, 0.4), rgba(26, 226, 154, 0));
    border-radius: 24px 24px 0 0;
    ${(props) => props.theme.breakpoints.up('sm')} {
      border-radius: 0px;
    }
    &:after,
    &:before {
      position: absolute;
      top: 1px;
      right: 1px;
      bottom: 0;
      left: 1px;
      background: white;
      border-radius: 24px 24px 0 0;
      content: '';
      ${(props) => props.theme.breakpoints.up('sm')} {
        border-radius: 0px;
      }
    }
    &:after {
      background: linear-gradient(180deg, rgba(211, 244, 117, 0.1) 0%, rgba(211, 244, 117, 0) 100%);
    }
  }
  .KuxModalHeader-root {
    position: relative;

    ${(props) => props.theme.breakpoints.down('sm')} {
      height: auto;
      padding: 24px 16px 20px;
    }
  }
  .KuxModalHeader-title {
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 100%;
    }
  }
`;
export const Content = styled.div`
  padding: 24px 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 16px 24px;

    h1:first-child {
      margin-top: 0px;
    }
  }
`;
export const HighlightText = styled(Button)`
  color: ${(props) => props.theme.colors.walletPrimary};
  font-size: 14px;
  font-weight: 500;
  font-family: Roboto;
  height: auto;
  img {
    width: 14px;
    margin-right: 4px;
  }
`;
export const H1 = styled.h1`
  font-size: 14px;
  font-style: normal;
  font-family: Roboto;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin: 16px 0 8px;
`;
export const Typography = styled.div`
  font-size: 14px;
  font-style: normal;
  font-family: Roboto;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text40};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
