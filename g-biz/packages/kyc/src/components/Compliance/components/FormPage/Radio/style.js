/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const RadioWrapper = styled.section`
  .radioTitle {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    margin-bottom: 12px;
    color: ${(props) => props.theme.colors.text};
    span {
      font-weight: 400;
      color: ${(props) => props.theme.colors.text60};
    }
    b {
      color: ${(props) => props.theme.colors.text};
    }
  }
  .KuxTab-TabItem {
    min-width: 138px;
  }
  &.isSmStyle {
    .KuxTabs-Container {
      width: 100%;
    }
    .KuxTab-TabItem {
      flex: 1;
    }
  }
`;
