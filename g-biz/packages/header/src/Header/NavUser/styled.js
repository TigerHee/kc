import { styled, css, Divider as CusDivider } from '@kux/mui';

export const NavUser = styled('div')(
  ({ navStatus, theme, inDrawer, inTrade }) => `
  display: flex;
  align-items: center;
  flex-direction: ${inDrawer ? 'column' : 'row'};
  & .navUserItem {
    color: ${theme.colors.text};
    cursor: pointer;
    padding: 0;
    text-decoration: none !important;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${inDrawer ? '100%' : 'auto'};
    white-space: nowrap;
    background-clip: border-box !important;
    [dir='rtl'] & {
      padding: ${inDrawer ? '0' : `0 0 0 12px`};
    }
    &[data-menu='i18n'],
    &[data-menu='currency'],
    &[data-menu='download'],
    &[data-menu='theme'] {
      display: ${navStatus !== 0 ? 'none' : 'flex'};
    }
    &[data-menu='order'],
    &[data-menu='asset'],
    &[data-menu='person'] {
      display: ${navStatus >= 4 ? 'none' : 'flex'};
    }
    &[data-menu='search'] {
      display: ${navStatus > 5 || inDrawer ? 'none' : 'flex'};
    }
    &[data-menu='person'] {
      display: 'flex';
    }
    &[data-menu='download'],
    &[data-menu='i18n'],
    &[data-menu='currency'],
    &[data-menu='notice'],
    &[data-menu='person'],
    &[data-menu='order'] {
      padding: 0;
    }
    &[data-menu='notice'] {
      margin-right: 12px;
      margin-left: ${navStatus > 5 ? '12px' : 0};
    }
    &[data-menu='person'],
    &[data-menu='order'],
    &[data-menu='notice'] {
      margin-left: 12px;
    }
    &[data-menu='download'] {
      [dir='rtl'] & {
        margin-right: 12px;
      }
    }

    &[data-menu='notice'] {
      [dir='rtl'] & {
        margin: 0;
      }
      & > span {
        border-radius: 32px 32px;
      }
      ${theme.breakpoints.down('sm')} {
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    &[data-menu='person'] {
      [dir='rtl'] & {
        margin-left: 0;
      }
    }

    &[data-menu='theme'] {
      [dir='rtl'] & {
        padding: ${inDrawer ? '0' : `0 12px 0 0`};
      }
    }

    &.signinLink {
      width: ${inDrawer ? '50%' : 'auto'};
      margin-right: ${inDrawer ? '12px' : 'unset'};
      @media screen and (max-width: 414px) {
        display: ${inDrawer ? 'unset' : 'none'};
      }
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 1;
      }
    }
    & .signinBtn {
      width: ${inDrawer ? '100%' : 'unset'};
      padding: ${inDrawer ? '12.5px 0' : inTrade ? '9px 12px' : '9px 12px'};
      font-weight: 500;
      font-size: ${inDrawer ? '16px' : inTrade ? '12px' : '14px'};
      line-height: 130%;
      text-align: center;
      color: ${theme.colors.text};
      margin: 0;
      transition: all .3s ease;
      border: ${inDrawer ? `1px solid ${theme.colors.text}` : 'unset'};
      border-radius: 24px;
      ${theme.breakpoints.down('sm')} {
        font-size: ${inDrawer ? '16px' : '12px'};
      }
      [dir='rtl'] & {
        margin: ${inDrawer ? '0 0 0 24px' : '0'};
      }
    }
    &.signUpLink {
      width: ${inDrawer ? '50%' : 'auto'};
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 1;
        & > img {
          display: block;
        }
      }
    }
    & .signUpBtn {
      width: ${inDrawer ? '100%' : 'unset'};
      padding: ${inDrawer ? '13.61px 0' : inTrade ? '6px 16px' : '9px 20px'};
      border-radius: 90px;
      font-weight: 700;
      font-size: ${inDrawer ? '16px' : inTrade ? '12px' : '14px'};
      text-align: center;
      color: ${theme.colors.textEmphasis};
      background: ${theme.currentTheme === 'dark' ? theme.colors.primary : theme.colors.text};
      position: relative;
      transition: all .3s ease;
      ${theme.breakpoints.down('sm')} {
        padding: ${inDrawer ? '13.61px 0' : inTrade ? '6px 16px' : '8px 16px'};
        font-size: ${inDrawer ? '16px' : '12px'};
      }
    }
    ${inTrade && {
      fontSize: '11.2px',
    }}
  }
`,
);

export const UserBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0;
  flex-direction: row;
  width: ${(props) => (props.inDrawer ? '100%' : 'auto')};
  padding: 0 12px;
  justify-content: ${(props) => (props.inDrawer ? 'space-between' : 'unset')};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 6px;
  }
`;

export const UserBoxComponent = styled.div`
  /* margin-left: 8px;

  [dir='rtl'] & {
    margin-left: 0;
  } */
`;

export const Divider = styled(CusDivider)`
  width: 1px;
  height: 16px;
  margin-left: 12px;
  [dir='rtl'] & {
    margin: 0 12px 0 0;
  }
`;

export const SearchWrapper = styled.div`
  height: 40px;
  width: 40px;
  background-color: ${(props) => props.theme.colors.cover4};
  border-radius: 50%;
  display: ${(props) => (props.status >= 3 ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 32px;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
  }
  ${(props) =>
    props.inTrade &&
    css`
      height: 32px;
      width: 32px;
      line-height: 30px;
      font-size: 14px;
    `}
  [dir='rtl'] & {
    transform: rotateY('180deg');
  }
`;
