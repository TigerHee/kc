/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-14 15:22:05
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-14 18:25:47
 */
import styled from '@emotion/styled';
import LottieProvider from 'src/components/LottieProvider';

export const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 40px;

  gap: 20px;
  margin-right: 20px;
  min-width: 280px;
  justify-content: ${({ pageIndex }) => (pageIndex > 0 ? 'flex-start' : 'center')};
  width: 100%;
  &:last-of-type {
    align-items: flex-start;
    margin-right: 40px;
  }
  &:first-of-type {
    /* margin-right: 0!important; */
  }
`;

export const PrizeLightAnimation = styled(LottieProvider)`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 140px;
`;
