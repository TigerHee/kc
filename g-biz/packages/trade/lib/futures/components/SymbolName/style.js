/**
 * tank@kupotech.com
 */
import { styled } from '@kux/mui';
export const Wrapper = styled.div `
  font-size: 16px;
  font-weight: 500;
  .symbol-name {
    line-height: 130%;
    white-space: nowrap;
  }
  &.mini {
    .symbol-name {
      font-size: 12px;
      font-weight: 400;
    }
  }
  &.small {
    .symbol-name {
      font-size: 14px;
      font-weight: 400;
    }
  }
  &.large {
    .symbol-name {
      font-size: 20px;
      font-weight: 600;
    }
    .symbol-tag {
      font-size: 14px;
    }
  }
`;
export const Content = styled.div `
  display: flex;
  align-items: center;
  .symbol-tag {
    margin-left: 4px;
  }
`;
export const ContentTag = styled.div `
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  .symbol-tag {
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    margin-left: 4px;
    padding: 0 3px;
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.cover4};
  }
`;
