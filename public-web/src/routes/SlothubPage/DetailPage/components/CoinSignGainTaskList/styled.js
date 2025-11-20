/*
 * @Date: 2024-05-27 18:33:02
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import styled from '@emotion/styled';

export const Wrap = styled.div`
  width: 100%;
  max-width: 1200px;
  border-radius: 20px;
  margin: 0 auto;
  background: ${(props) => props.theme.colors.backgroundMajor};
  padding: 32px;
  border: 1px solid ${(props) => props.theme.colors.cover8};

  ${({ theme }) => theme.breakpoints.down('lg')} {
    max-width: 720px;
    margin-top: 60px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 0;
    padding: 16px;
    border: 0;
  }
`;
export const Title = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-weight: 400;
  line-height: 130%; /* 31.2px */
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    font-weight: 700;
    font-size: 18px;
  }
`;

export const TaskItem = styled.section`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  padding: 24px;
  margin-bottom: 24px;
  position: relative;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    padding: 16px;
  }
`;

export const TaskTitle = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 12px;
  z-index: 1;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
    font-size: 15px;
  }

  span {
    color: #01bc8d;
  }
`;
export const TaskDesc = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 23px;
  z-index: 1;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    font-size: 12px;
  }
  span {
    color: #01bc8d;
  }
`;

export const RowWrap = styled.div`
  display: flex;
`;

export const RightIcon = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  width: 68px;
  height: 66px;
  z-index: 0;
`;
