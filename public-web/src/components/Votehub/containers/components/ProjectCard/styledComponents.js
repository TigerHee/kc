/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledCard = styled.div`
  width: 100%;
  border-radius: 12px;
  padding: 16px;
  position: relative;

  .rankLogo {
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 2;
    height: 36px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px;
    .rankLogo {
      position: absolute;
      top: 0;
      right: 16px;
      z-index: 2;
      height: 48px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 24px;
  }

  &.num1 {
    position: relative;
    z-index: 1;
    background-image: linear-gradient(
      ${(props) => (props.theme.currentTheme === 'light' ? '#fde4c3' : '#96876c')},
      ${(props) => props.theme.colors.cover8}
    );
    &::before {
      position: absolute;
      top: 1px;
      left: 1px;
      z-index: -1;
      display: block;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      background: linear-gradient(
          180deg,
          rgba(229, 184, 107, 0.2) 0.27%,
          rgba(229, 184, 107, 0) 25.99%
        ),
        ${(props) => (props.theme.currentTheme === 'light' ? '#ffffff' : '#171717')};
      border-radius: 11px;
      content: '';
    }
  }

  &.num2 {
    position: relative;
    z-index: 1;
    background-image: linear-gradient(
      ${(props) => (props.theme.currentTheme === 'light' ? '#c9d7f3' : '#7f8ba8')},
      ${(props) => props.theme.colors.cover8}
    );
    &::before {
      position: absolute;
      top: 1px;
      left: 1px;
      z-index: -1;
      display: block;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      background: linear-gradient(
          180deg,
          rgba(144, 165, 194, 0.2) 0.27%,
          rgba(144, 165, 194, 0) 25.99%
        ),
        ${(props) => (props.theme.currentTheme === 'light' ? '#ffffff' : '#171717')};
      border-radius: 11px;
      content: '';
    }
  }

  &.num3 {
    position: relative;
    z-index: 1;
    background-image: linear-gradient(
      ${(props) => (props.theme.currentTheme === 'light' ? '#a5f3df' : '#59a693')},
      ${(props) => props.theme.colors.cover8}
    );
    &::before {
      position: absolute;
      top: 1px;
      left: 1px;
      z-index: -1;
      display: block;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      background: linear-gradient(
          180deg,
          rgba(122, 246, 215, 0.2) 0.27%,
          rgba(1, 188, 141, 0) 25.99%
        ),
        ${(props) => (props.theme.currentTheme === 'light' ? '#ffffff' : '#171717')};
      border-radius: 11px;
      content: '';
    }
  }

  &.num {
    // background: ${(props) => props.theme.colors.overlay};
    // 黑色写死 #171717 白色写死#ffffff  非组件库对应值
    background: ${(props) => (props.theme.currentTheme === 'light' ? '#ffffff' : '#171717')};
    border: ${(props) => `1px solid ${props.theme.colors.divider8}`};
  }

  // 仅pad模式下会出现，不需要加响应式
  &.specialCard {
    .symbolInfoBar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;

      .tip {
        margin-bottom: 10px;
        margin-left: 12px;
        color: ${(props) => props.theme.colors.text40};
        font-weight: 500;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;

        &.active {
          color: ${(props) => props.theme.colors.primary};
        }
      }
    }
    .buttonBar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .desc {
        margin-right: 32px;
      }
      > div {
        // width: calc(50% - 30px);
        margin-top: 0;
      }

      button {
        width: 144px;
      }
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
      min-height: 36px;
      font-size: 14px;
    }
  }
`;

export const SymbolInfoWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 16px;

  .logo {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border-radius: 52px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 16px;
    .logo {
      width: 40px;
      height: 40px;
      margin-right: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 16px;
    .logo {
      width: 42px;
      height: 42px;
      margin-right: 16px;
    }
  }

  // 仅pad下
  &.specialSymbolInfo {
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-right: 16px;
      margin-bottom: 16px;
      .logo {
        width: 40px;
        height: 40px;
        margin-right: 16px;
      }

      .name {
        margin-right: 12px !important;
        font-size: 28px !important;
        line-height: 28px !important;
      }

      .subName {
        font-size: 16px !important;
        line-height: 130% !important;
      }
    }
  }
`;

export const NameWrapper = styled.div`
  display: inline-flex;
  align-items: flex-end;
  .name {
    margin-right: 6px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 18px;
    font-style: normal;
    line-height: 18px;
  }

  .subName {
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 16px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .name {
      margin-right: 12px;
      font-size: 24px;
      line-height: 24px;
    }

    .subName {
      font-size: 14px;
      line-height: 130%;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .name {
      margin-right: 12px;
      font-size: 28px;
      line-height: 28px;
    }

    .subName {
      font-size: 16px;
      line-height: 130%;
    }
  }
`;

export const SymbolInfoHot = styled.div`
  // margin-top: 20px;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    font-weight: 600;
    font-size: 16px;
    font-size: 16px;
    img {
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-weight: 600;
    font-size: 18px;
    font-size: 18px;
    img {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }

  &.specialHot {
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 14px;

      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    }
  }
`;
export const SymbolInfoButton = styled.div`
  margin-top: 16px;
  display: flex;
  button {
    flex: 1;
    &:nth-of-type(2n) {
      margin-left: 12px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 24px;
  }
`;

export const HotWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tip {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;

    &.active {
      color: ${(props) => props.theme.colors.primary};
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;

    .tip {
      font-size: 14px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 32px;
  }
`;

export const EmptyWrapper = styled.div`
  height: 4px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    height: 8px;
  }
`;
