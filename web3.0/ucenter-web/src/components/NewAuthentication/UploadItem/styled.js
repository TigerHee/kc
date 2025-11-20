/**
 * Owner: lori@kupotech.com
 */

import { styled } from '@kux/mui';

export const UploadAre = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 240px;
  width: 100%;
  border-radius: 4px;
  background-size: 100% 100%;
  border: 1px dashed;
  padding: 46px 32px;
  border-color: ${({ theme }) => theme.colors.text20};
  background: ${({ theme }) => theme.colors.cover2};
  cursor: pointer;

  &:hover {
    border: 1px dashed;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 143px;
    padding: 20px;
  }
`;

export const UploadImg = styled.img`
  width: auto;
  max-width: 860px;
  height: 238px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 100%;
    height: 141px;
  }
`;

export const UploadIconWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(140, 140, 140, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 40px;
    height: 40px;
  }
`;

export const UploadIcon = styled.img`
  width: 32px;
  height: 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 16px;
    height: 16px;
  }
`;

export const UploadText = styled.div`
  line-height: 22px;
  font-size: 16px;
  color: #00142a;
  margin-top: 12px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
    font-size: 14px;
  }
`;

export const UploadTipText = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
