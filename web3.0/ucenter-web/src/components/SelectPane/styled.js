/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const SelectWrapper = styled.div`
  width: 250px;
`;

export const LangItem = styled.div`
  display: inline-block;
  width: 50%;
  height: 32px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.overlay};
  }
`;

export const bgGray = (theme) => css`
  color: ${theme.colors.primary};
  background: ${theme.colors.overlay};
`;

export const SelectPop = styled.div``;

export const Pointer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    i {
      transform: scale(0.6) rotate(180deg);
    }
  }
  i {
    transform: scale(0.6);
    transition: transform 0.2s;
  }
`;

export const IsplayArrow = styled.div`
  transform: rotate(180deg);
`;
