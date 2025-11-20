/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .imgBox {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    padding: 12px;
    background-color: var(--color-cover2);
    img {
      width: 138px;
      height: 138px;
    }
  }
  .text40 {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: var(--color-text40);
  }
  .section {
    margin-bottom: 4px;
  }
  .title {
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    margin-bottom: 4px;
    color: var(--color-text);
  }
  .total {
    margin-bottom: 16px;
  }
  .list {
    margin-bottom: 16px;
  }
  .listItem {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    display: inline-block;
    color: var(--color-text60);
    &:not(:last-of-type) {
      margin-bottom: 24px;
    }
    b {
      font-weight: 500;
      color: var(--color-text);
    }
  }
  &.isSmStyle {
    padding: 8px 0;
    .imgBox {
      padding: 8px;
      img {
        width: 180px;
        height: 180px;
      }
    }
    .text40 {
      font-size: 14px;
    }
    .title {
      font-size: 20px;
    }
    .total {
      margin-bottom: 12px;
    }
    .list {
      margin-bottom: 24px;
    }
    .listItem {
      font-size: 14px;
    }
  }
`;
