/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledFAQ = styled.section`
  width: 100%;
  margin: 0 auto;
  padding: 0 16px 40px;
  .title {
    margin-bottom: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    ${(props) => props.theme.fonts.size.x3l};
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 24px 80px;
    .title {
      margin-bottom: 24px;
      ${(props) => props.theme.fonts.size.x5l};
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 1200px;
    padding: 0 0 120px;
    .title {
      margin-bottom: 40px;
      ${(props) => props.theme.fonts.size.x6l};
    }
  }
`;

export const FAQContainer = styled.div`
  div.KuxAccordion-root {
    margin-bottom: 16px;
    padding: 16px;
    background-color: ${(props) => props.theme.colors.cover2};
    border-radius: 16px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .KuxAccordion-head {
      padding: 0;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      .KuxAccordion-iconWrapper {
        svg {
          width: 20px;
          height: 20px;
          margin-left: 8px;
          color: ${(props) => props.theme.colors.text};
          vertical-align: middle;
        }
      }
    }

    .KuxAccordion-panel {
      padding: 0;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 150%;

      a {
        color: ${(props) => props.theme.colors.primary};
        cursor: pointer;
        text-decoration-line: underline;
      }

      .KuxDivider-root {
        margin: 16px 0;
        background: ${(props) => props.theme.colors.cover4};
      }
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-bottom: 24px;
      padding: 32px 40px;

      .KuxAccordion-head {
        font-size: 24px;

        .KuxAccordion-iconWrapper {
          svg {
            width: 32px;
            height: 32px;
            margin-left: 16px;
          }
        }
      }

      .KuxAccordion-panel {
        font-size: 18px;

        .KuxDivider-root {
          margin: 40px 0;
        }
      }
    }

    .KuxAccordion-activeBg {
      display: none;
    }
  }
`;
