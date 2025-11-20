/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-14 11:22:11
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-14 18:25:42
 */
import styled from '@emotion/styled';
import { Box } from '@kux/mui';
import { GridContainer } from './index.styled';

export const Wrap = styled.div`
  display: flex;
  align-items: center;
`;

export const CarouselWrap = styled.div`
  position: relative;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 0 20px;
  width: 440px;

  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const CarouselContainerWrap = styled(Box)`
  position: relative;
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const PageArrowWrap = styled.span`
  width: 36px;
  height: 36px;
  background-color: rgba(29, 29, 29, 0.3);
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    width: 24px;
    height: 24px;
    color: ${({ disabled }) => (disabled ? 'rgba(140, 140, 140, 0.4)' : '#fff')};
  }
`;

export const CarouselGridContainer = styled(GridContainer)`
  min-width: 380px;

  :last-of-type {
    min-width: 380px;
  }
`;
