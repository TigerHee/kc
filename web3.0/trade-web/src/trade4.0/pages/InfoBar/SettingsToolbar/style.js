/**
 * Owner: Ray.Lee@kupotech.com
 */
import { styled, css } from '@/style/emotion';
import SvgComponent from '@/components/SvgComponent';
import Divider from '@mui/Divider';
import IconLabel from './IconLabel';

export const ToolBarWrapper = styled.div`
  height: 48px;
  align-items: center;
  display: flex;
  justify-content: center;
  background: ${props => props.theme.colors.layer};
  ${(props) => props.theme.breakpoints.up('sm')} {
    background: ${(props) => props.theme.colors.overlay};
    margin-right: -8px;
  }
  svg {
    cursor: pointer;
  }
`;

export const IconWrapper = styled(SvgComponent)`
  margin: 0 8px;
  color: ${(props) => props.theme.colors.icon};
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const DividerWrapper = styled(Divider)`
  height: 12px;
  margin: 0 6px;
`;

export const DialogContentWrapper = styled.div`
  a,
  button {
    color: ${(props) => props.theme.colors.textPrimary};
    text-decoration: none;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    color: ${(props) => props.theme.colors.text60};
  }
  .KuxButton-root {
    text-align: left;
  }
`;
export const DrawerContentWrapper = styled.div`
  position: relative;
  color: ${(props) => props.theme.colors.text40};
  padding: 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px 32px;
  }

  height: 100%;
  .row {
    display: flex;
    justify-content: space-between;
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }
    .col {
      &:first-of-type {
        text-align: left;
      }
      &:last-of-type {
        text-align: right;
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
  .divider {
    height: 1px;
    background-color: ${(props) => props.theme.colors.divider8};
    margin: 24px 0;
  }
  .region-restricted {
    .title {
      margin-bottom: 12px;
    }
    .content {
      color: ${(props) => props.theme.colors.text60};
      line-height: 150%;
    }
  }
  .confirm-button {
    position: absolute;
    ${({ isSm }) => !isSm && css`
      bottom: 20px;
      right: 32px;
    `}
    ${({ isSm }) => isSm && css`
      width: calc(100% - 32px);
      bottom: 15px;
    `}
  }
`;

export const BackClassicVersion = styled(IconLabel)`
  margin-left: 0;
`;
