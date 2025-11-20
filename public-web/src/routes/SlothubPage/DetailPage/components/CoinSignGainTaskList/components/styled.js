/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-05-29 21:30:56
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-18 16:37:56
 */
import styled from '@emotion/styled';
import { HorizontalCenterWrap, VerticalWrap } from './AtomComponents/styled';

export const Content = styled.div`
  position: relative;
  z-index: 1;
  border-radius: 20px;
  padding: 16px;
  border: 1px solid ${(props) => props.theme.colors.cover8};
  background-color: ${(props) => props.theme.colors.overlay};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    border: 1px solid ${(props) => props.theme.colors.cover4};
    border-radius: 12px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.04);
  }
`;

export const ProcessData = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
  .grey {
    color: ${(props) => props.theme.colors.text40};
  }

  .green {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 16px;
    line-height: 130%;

    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-weight: 500;
      font-size: 13px;
    }
  }
`;

export const ProcessDesc = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 4px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-width: 80px;
    padding-right: 8px;
    font-size: 12px;
  }

  .green {
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;

    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-weight: 500;
      font-size: 13px;
    }
  }
`;

export const ProcessDescItem = styled(VerticalWrap)`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-right: 48px;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;

export const H5ProcessBar = styled(HorizontalCenterWrap)`
  justify-content: space-between;
  margin-top: 8px;
`;

export const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 14px;
    height: 14px;
  }
`;

export const EqualRadioProcessDescItem = styled(ProcessDescItem)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex: 1;
  }
`;
