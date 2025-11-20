/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const ContentWrapper = styled.div`
  padding: 20px 16px 10px;

  .KuxInput-disabled {
    opacity: 1;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 10px 0 50px;
  }
`;

export const FooterWrapper = styled.div`
  padding: 0 16px 45px;

  .ticketWrapper {
    .needNum {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;

      span.value {
        // margin: 0 6px;
        color: ${(props) => props.theme.colors.primary};
        font-weight: 700;
        font-size: 16px;
        font-style: normal;
        line-height: 130%;
      }
    }

    .owenNum {
      margin-left: 6px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;

      &.complementary {
        color: ${(props) => props.theme.colors.complementary};
      }
    }
  }

  .btnWrapper {
    display: flex;
    align-items: center;
    margin-top: 16px;
    > button {
      width: calc(50% - 4px);
      &:last-of-type {
        margin-left: 8px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 32px;
    border-top: 0.5px solid ${(props) => props.theme.colors.divider8};
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.08) inset;
    .ticketWrapper {
      flex: 1;
      margin-right: 12px;
      .needNum {
        font-size: 14px;

        span.value {
          color: ${(props) => props.theme.colors.text};
          font-size: 24px;
        }
      }

      .owenNum {
        font-size: 14px;
      }
    }

    .btnWrapper {
      display: inline-flex;
      align-items: center;
      margin-top: 0;
      > button {
        width: 120px;
        &.KuxButton-text {
          width: unset;
          color: ${(props) => props.theme.colors.text60};
        }
        &:last-of-type {
          margin-left: 24px;
        }
      }
    }
  }
`;
