/**
 * Owner: judith.zhu@kupotech.com
 */

import { styled } from '@kux/mui/emotion';

export const Root = styled.div`
  font-size: 14px;
  line-height: 22px;
  margin-top: 10px;
  a {
    &,
    &:hover,
    &:active,
    &:focus {
      color: #24ae8f;
      opacity: 1;
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Description = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text30};
  opacity: 1;
`;

export const Title = styled.span`
  color: ${({ theme }) => theme.colors.text};
  margin-left: 6px;
  :global {
    .liability {
      color: ${({ theme }) => theme.colors.text60};
      opacity: 1;
    }
  }
`;
