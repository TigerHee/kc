/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-18 17:38:27
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-19 23:54:42
 */
import styled from '@emotion/styled';
import Button from 'src/routes/SlothubPage/components/mui/Button';

export const TaskButton = styled(Button)`
  &.KuxButton-disabled {
    color: rgba(29, 29, 29, 0.3);
    background: rgba(29, 29, 29, 0.04);
  }
  &.KuxButton-loading {
    > svg {
      margin-right: 0;
    }
  }
  ${({ isGreen }) => {
    if (!isGreen) return ``;
    return `background: #d3f475;
    color: #1d1d1d;
    &:hover,
    &:visited,
    &:active {
      color: #1d1d1d;
      background: #d3f475;
    }`;
  }}
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 32px;
  }
`;

export const ButtonWrap = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
`;

export const TimesPoint = styled.span`
  position: absolute;
  right: 0;
  top: -10px;
  border-radius: 46px;

  background: #282828;
  color: #fff;
  padding: 2px 4px;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  text-align: center;
`;
