/**
 * Owner: mike@kupotech.com
 */
import { css } from '@emotion/css';
import styled from '@emotion/styled';

export const Page = styled.div`
  min-height: 100%;
`;

export const Container = styled.div`
  background: ${({ theme }) => theme.colors.cover4};
  border-radius: 8px;
  padding: 12px;
  color: ${({ theme }) => theme.colors.text40};
  font-size: 12px;
  > div {
    font-size: 12px;
    line-height: 130%;
    margin-bottom: 6px;
  }
`;


export const CircularOpeningConditionBox = styled.div`
  margin-left: -16px;
  margin-right: -16px;
  padding-bottom: 26px;
  ul {
    padding: 0;
    margin-bottom: 16px;
  }
  li {
    padding: 10px 16px;
    position: relative;
    color: ${({ theme }) => theme.colors.text};
    &.active,
    &:active {
      background-color: ${({ theme }) => theme.colors.cover4};
    }
    > svg {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 16px;
      margin: auto;
    }
  }
  .btn-plain {
    padding: 0;
  }
`;
