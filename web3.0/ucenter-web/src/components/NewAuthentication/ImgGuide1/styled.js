/**
 * Owner: lori@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const TipImgs = styled.div`
  width: 100%;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
    justify-content: center;
  }
`;

export const TipItem = styled.div`
  border-radius: 8px;
  width: 100%;
  max-width: 197px;
  height: 100px;
  background: ${({ theme }) => theme.colors.cover4};
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  padding-top: 12px;
  img {
    width: 80px;
    height: 56px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
    width: calc((100vw - 40px) / 2);
    max-width: 50vw;
    height: 94px;
    img {
      width: 60px;
      height: 42px;
    }
  }
`;

export const TipItem2 = styled.div`
  border-radius: 8px;
  width: 100%;
  max-width: 197px;
  height: 100px;
  background: ${({ theme }) => theme.colors.cover4};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  font-size: 12px;
  padding-top: 12px;
  img {
    width: 50px;
    height: 56px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
    width: calc((100vw - 40px) / 2);
    height: 94px;
    img {
      width: 38px;
      height: 42px;
    }
  }
`;

export const TipImgDesc = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
`;

export const Desc = styled.div`
  margin: 12px 0 24px;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text};
`;

export const NeededItemsPrefix0 = styled.div`
  color: #f65454;
  margin-right: 2px;

  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 2px;
  }
`;

export const redText = css`
  color: #eb6666;
  /* color: ${({ theme }) => theme.colors.red}; */
`;
