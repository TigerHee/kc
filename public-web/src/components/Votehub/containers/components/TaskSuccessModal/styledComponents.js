/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const MaskWrapper = styled.div`
  position: fixed;
  z-index: 100;
  // background-color: ${(props) => props.theme.colors.mask};
  // 针对动画黑白主题都是这个颜色
  background-color: rgba(0, 0, 0, 0.8);
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &.in {
    animation: fadeIn 300ms cubic-bezier(0.2, 0, 0, 1);
  }

  // &.out {
  //   opacity: 0;
  //   animation: fadeOut 280ms cubic-bezier(0.3, 0, 0, 1);
  // }

  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 700px;
    height: 585px;
    transform: translateX(-50%) translateY(-50%);

    .bgWrapper {
      position: absolute;
      top: -55px;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;

      > div {
        width: 100%;
        height: 100%;
      }
    }

    .contentDialog {
      position: relative;
      z-index: 2;
      width: calc(100vw - 56px);
      width: 320px;
      padding: 24px 32px;
      background-color: ${(props) => props.theme.colors.overlay};
      border-radius: 20px;
      animation: flipInY 1s cubic-bezier(0.23, 0.09, 0.52, 0.88);

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        color: ${(props) => props.theme.colors.text};
        > span {
          font-weight: 600;
          font-size: 20px;
          font-style: normal;
          line-height: 130%;
        }

        span.close {
          border: 1px solid ${(props) => props.theme.colors.cover8};
          svg {
            color: ${(props) => props.theme.colors.text};
          }
        }
      }
      .content {
        position: relative;
        width: 100%;
        height: 134px;
        margin-bottom: 24px;
        .star1 {
          position: absolute;
          bottom: 47px;
          left: 0;
          z-index: 2;
          width: 22px;
          height: 22px;
        }
        .star2 {
          position: absolute;
          top: -6px;
          left: 60px;
          z-index: 2;
          width: 12px;
          height: 12px;
        }
        .star3 {
          position: absolute;
          top: 25px;
          right: 0;
          z-index: 2;
          width: 26px;
          height: 26px;
        }
        .successBg {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 97px;
        }
        .successCoin {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 3;
          width: 96px;
          height: 134px;
          transform: translateX(-50%);
        }

        .info {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 4;
          width: 96px;
          height: 134px;
          padding: 70px 6px 0;
          text-align: center;
          transform: translateX(-50%);
          .value {
            color: ${(props) => props.theme.colors.primary};
            font-weight: 700;
            font-size: 14px;
            font-style: normal;
            line-height: 130%;
          }
          .name {
            margin-top: 4px;
            color: ${(props) => props.theme.colors.text40};
            font-weight: 500;
            font-size: 12px;
            font-style: normal;
            line-height: 130%;
          }
        }
      }
    }

    span.close {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      min-width: 34px;
      max-width: 34px;
      height: 34px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 34px;
      cursor: pointer;

      svg {
        width: 14px;
        height: 14px;
        color: #fff;
      }
    }

    .closeWrapper {
      position: relative;
      z-index: 102;
      margin-top: 24px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .dialog {
      width: 1000px;
      height: 834px;
      .contentDialog {
        width: 480px;
        padding: 32px;

        .header {
          margin-bottom: 48px;
          > span {
            font-size: 28px;
          }
        }

        .content {
          width: 100%;
          height: 152px;
          margin-bottom: 40px;
          .star1 {
            bottom: 36px;
            left: 17px;
          }
          .star2 {
            top: -12px;
            left: 130px;
          }
          .star3 {
            right: 17px;
            bottom: 63px;
          }
          .successBg {
            bottom: 0;
            left: 17px;
            width: 382px;
            height: 140px;
          }
          .successCoin {
            width: 96px;
            height: 134px;
          }
        }
      }
    }
  }

  @keyframes flipInY {
    0% {
      transform: scaleX(0) scaleY(0.2);
    }

    13.3% {
      transform: scaleX(0.67) scaleY(0.67);
    }

    26.6% {
      transform: scaleX(0.1) scaleY(0.98);
    }

    40% {
      transform: scaleX(1.05) scaleY(1.05);
    }

    60% {
      transform: scaleX(0.98) scaleY(0.98);
    }

    76% {
      transform: scaleX(1) scaleY(1);
    }

    100% {
      transform: scaleX(1) scaleY(1);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
`;
