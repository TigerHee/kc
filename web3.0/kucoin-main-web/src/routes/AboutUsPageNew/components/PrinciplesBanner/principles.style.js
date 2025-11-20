/**
 * Owner: will.wang@kupotech.com
 */

import { styled } from '@kux/mui';

export const PrincipleWrapper = styled.section`
  width: 1200px;
  margin: 0 auto;
  padding: 160px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    padding: 120px 32px 120px;
    gap: 64px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px 40px;
    gap: 20px;
  }
`;

export const PrincipleWrapperTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  line-height: 1.3;

  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export const PrincipleWrapperGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  width: 100%;
  list-style: none;
  margin: 0px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    grid-template-columns: 1fr;
    gap: 24px;
    width: 100%;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 12px;
  }
`;

export const PrincipleWrapperGridCard = styled.li`
  display: flex;
  align-items: center;
  min-height: 88px;
  padding: 0px 24px;
  gap: 16px;

  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.cover12};

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
    min-height: 53px;
    gap: 12px;
  }
`;

export const PrincipleWrapperGridCardIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

export const PrincipleWrapperGridCardContent = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  word-break: break-all;
  white-space: pre-wrap;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
