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
    color: var(--color-text);
    span {
      font-weight: 400;
      color: var(--color-text60);
    }
    b {
      color: var(--color-text);
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
