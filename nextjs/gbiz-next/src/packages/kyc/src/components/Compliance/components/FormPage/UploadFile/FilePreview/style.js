/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 224px;
  height: 143px;
  padding-top: 47px;
  .content {
    height: 100%;
    background-color: var(--color-overlay);
    border-radius: 10.299px 10.299px 0 0;
    border-top: 0.644px solid var(--color-cover8);
    border-right: 0.644px solid var(--color-cover8);
    border-left: 0.644px solid var(--color-cover8);
    padding: 16px;
  }
  .fileTitle {
    text-align: start;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%;
    color: var(--color-icon);
    margin-bottom: 5px;
  }
  .lineBox {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .line {
    border-radius: 1.287px;
    background: var(--color-cover4);
    width: 100%;
    height: 8px;
  }
  .line1 {
    width: 50%;
  }
`;
