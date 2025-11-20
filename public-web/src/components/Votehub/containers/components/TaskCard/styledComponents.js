/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledTask = styled.div`
  width: 100%;
  padding: 20px 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  &.specialTask {
    display: block;
  }

  &.isInModal {
    .info {
      .titleWrapper {
        ${(props) => props.theme.breakpoints.up('sm')} {
          font-size: 18px;
          .title {
            svg {
              width: 18px;
              height: 18px;
              margin-top: -4px;
              margin-left: 4px;
            }
          }
        }
      }
      .desc {
        ${(props) => props.theme.breakpoints.up('sm')} {
          font-size: 14px;
        }
      }
      .label {
        font-size: 12px;

        ${(props) => props.theme.breakpoints.up('sm')} {
          font-size: 14px;
        }
      }
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      padding: 24px 0;
    }
  }

  .info {
    flex: 1;
    .titleWrapper {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      .title {
        // display: inline-flex;
        // align-items: center;
        svg {
          width: 14px;
          height: 14px;
          margin-top: -2px;
          margin-left: 4px;
          vertical-align: middle;
        }
      }

      .tag {
        height: 15px;
        margin-left: 6px;
        padding: 0 4px;
        color: ${(props) => props.theme.colors.primary};
        font-weight: 400;
        font-size: 12px;
        font-size: 10px;
        font-style: normal;
        line-height: 15px;
        white-space: nowrap;
        background: ${(props) => props.theme.colors.primary8};
        border-radius: 2px;
      }

      ${(props) => props.theme.breakpoints.up('sm')} {
        font-size: 24px;
        .title {
          svg {
            width: 20px;
            height: 20px;
            margin-top: -4px;
            margin-left: 6px;
          }
        }
        .tag {
          margin-left: 16px;
        }
      }
    }

    .desc {
      margin-top: 6px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;

      > span.value {
        color: ${(props) => props.theme.colors.primary};
      }

      ${(props) => props.theme.breakpoints.up('sm')} {
        margin-top: 16px;
        font-size: 18px;
      }
    }

    .label {
      margin-top: 6px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;

      .active {
        color: ${(props) => props.theme.colors.primary};
      }

      // .num {
      //   color: ${(props) => props.theme.colors.primary};
      //   font-weight: 500;
      // }

      .value {
        font-weight: 500;
      }

      ${(props) => props.theme.breakpoints.up('sm')} {
        margin-top: 16px;
        font-size: 18px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 32px 0;
  }
`;
