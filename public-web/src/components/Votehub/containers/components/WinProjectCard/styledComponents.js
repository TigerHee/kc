/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledWinProjectCard = styled.div`
  width: 100%;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  z-index: 1;
  background-image: linear-gradient(
    130deg,
    ${(props) => (props.theme.currentTheme === 'light' ? '#fee9ca' : '#78633c')},
    ${(props) => (props.theme.currentTheme === 'light' ? '#f4f4f4' : '#2a2418')}
  );

  &::before {
    position: absolute;
    top: 1px;
    left: 1px;
    z-index: -1;
    display: block;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    background: linear-gradient(180deg, rgba(255, 190, 70, 0.3) 0.79%, rgba(255, 190, 70, 0) 50.07%),
      ${(props) => (props.theme.currentTheme === 'light' ? '#ffffff' : '#171717')};
    border-radius: 11px;
    content: '';
  }

  .logo {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border: ${(props) => `2px solid ${props.theme.colors.complementary}`};
    border-radius: 52px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px;
    .logo {
      width: 40px;
      height: 40px;
      margin-right: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 24px;
    .logo {
      width: 42px;
      height: 42px;
      margin-right: 16px;
    }
  }

  .desc {
    display: -webkit-box;
    overflow: hidden;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 13px;
    font-style: normal;
    line-height: 130%;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 14px;
    }
  }

  .bttomBar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;

    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-top: 24px;
      button {
        width: 144px;
      }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      margin-top: 32px;
      button {
        width: 187px;
      }
    }
  }
`;

export const SymbolInfoHot = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 0;
    font-weight: 600;
    font-size: 16px;
    img {
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 18px;
    img {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }
`;
