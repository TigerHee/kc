/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledHeader = styled.div`
  position: relative;
  height: 88px;
  display: flex;
  align-items: flex-end;
  box-sizing: content-box;
  .app-custom-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 88px;
    padding: 44px 16px 0;
    color: ${(props) => props.theme.colors.text};
    color: #fff;
    background-color: transparent;
    transition: background-color 100ms linear;
    will-change: background-color;
    &.fillHeader {
      background-color: ${(props) => (props.bgColor ? props.bgColor : props.theme.colors.overlay)};
    }
    button {
      padding: 0;
      color: inherit;
      font: inherit;
      background: none;
      border: none;
      outline: inherit;
      cursor: pointer;
    }
    .back-arrow-icon {
      position: absolute;
      bottom: 12px;
      left: 16px;
      transform: rotate(180deg);
      [dir='rtl'] & {
        transform: rotate(0deg);
      }

      svg {
        width: 20px;
        height: 20px;
        color: ${(props) => props.theme.colors.text};
      }
    }

    .extra {
      position: absolute;
      right: 16px;
      bottom: 12px;

      svg {
        width: 20px;
        height: 20px;
        color: ${(props) => props.theme.colors.text};
      }
    }

    .title-text {
      h1 {
        margin: 0;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 18px;
        font-style: normal;
        line-height: 44px;
        text-align: center;
      }
      &.transparent {
        h1 {
          color: transparent;
        }
      }
    }

    &.fillHeader {
      .title-text {
        h1 {
          color: ${(props) => props.theme.colors.text};
        }
      }
    }
  }
`;
