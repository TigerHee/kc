/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const Container = styled.div`
  .title {
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
    margin-bottom: 24px;
    color: var(--color-text);
  }
  .subtitle {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 8px;
    color: var(--color-text);
  }
  .referenceList {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
    width: 100%;
  }
  .referenceItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    img {
      width: 100%;
    }
    span {
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
      text-align: center;
      color: var(--color-text);
    }
  }
  .uploadBox {
    width: 100%;
    display: flex;
    gap: 24px;
  }
  .uploadItem {
    flex: 1;
    flex-shrink: 0;
  }
  &.isSmStyle {
    .referenceList {
      margin-bottom: 24px;
      gap: 10px;
    }
    .uploadBox {
      flex-direction: column;
      gap: 0;
    }
  }
`;
