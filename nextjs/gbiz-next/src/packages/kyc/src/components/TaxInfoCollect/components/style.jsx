/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const Main = styled.div`
  padding: 24px 32px 0;
  flex: 1;
  overflow-y: auto;
  &.isNoPt {
    padding-top: 0;
  }
  &.isH5Style {
    padding: 0 16px;
  }
  &::-webkit-scrollbar {
    width: 4px;
    background-color: var(--color-background);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-icon40);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--color-background);
    border-radius: 4px;
  }
`;
export const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 31.2px;
  padding-bottom: 8px;
  color: var(--color-text);
`;
export const Desc = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  margin-bottom: 8px;
  color: var(--color-text40);
  &:last-of-type {
    margin-bottom: 24px;
    span {
      cursor: auto;
      color: var(--color-text40);
      text-decoration: none;
    }
  }
  span {
    cursor: pointer;
    text-decoration: underline;
    color: var(--color-text);
  }
`;
export const Footer = styled.div`
  flex-shrink: 0;
  padding: 20px 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &.isH5Style {
    padding: 16px;
    width: 100%;
    position: static;
    bottom: 0;
  }
  &.isShowBorderTop {
    border-top: 1px solid var(--color-divider8);
  }
  .KuxButton-text {
    margin-right: 24px;
    color: var(--color-text60);
  }
`;
