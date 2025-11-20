/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const UcenterPage = styled.div`
  background: ${({ theme }) => theme.colors.overlay};
  min-height: 100vh;
`;

export const UcenterPageBody = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 26px 0 0 0;
  font-size: 14px;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 24px 24px 24px 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 24px 12px 12px 12px;
  }
`;

export const fullBtn = css`
  width: 100%;
  margin: 12px 0;
  margin-bottom: 164px;
`;

export const UcenterPageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
  width: 100%;
  max-width: 520px;
`;

export const ContentTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

export const UcenterPageHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 80px;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: 30px 0 80px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0 0 48px;
  }
  img {
    margin-right: 8px;
  }
`;

export const Line = styled.div`
  width: 1px;
  height: 16px;
  margin: 0 12px;
  background: rgba(0, 20, 42, 0.12);
`;

export const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  padding: 0;
  margin: 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

export const SelectItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
  padding: 16px;
  background: ${({ theme }) => `${theme.colors.overlay}`};
  border: 1px solid;
  border-color: ${({ theme }) => `${theme.colors.text20}`};
  border-radius: 16px;
  cursor: pointer;
`;

export const Des = styled.div`
  color: ${({ theme }) => `${theme.colors.text}`};
  padding: 0 12px;
  flex: 1;
`;

export const Circle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid;
  border-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.text20};
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 60%;
  }
`;

export const SelectItemActive = styled(SelectItem)`
  background: ${({ theme }) => `${theme.colors.overlay}`};
  border: ${({ theme }) => `1px solid ${theme.colors.primary}`};
`;

export const LoadingPage = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SelectItemWrapper = styled.div`
  margin-top: 24px;
  width: 100%;
`;
