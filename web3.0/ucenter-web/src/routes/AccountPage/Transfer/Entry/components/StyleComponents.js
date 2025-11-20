/**
 * Owner: john.zhang@kupotech.com
 */

import styled from '@emotion/styled';
import { Dialog, MDrawer } from '@kux/mui';

export const Tag = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.cover4};
  border-radius: 24px;
  padding: 6px 12px;
  font-weight: 700;
`;

export const FreezeCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FreezeCellTitle = styled.div`
  display: flex;
  gap: 4px;
`;

export const FreezeCrypto = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text60};
`;

export const StyledDialog = styled(Dialog)`
  padding: 32px;

  .KuxDialog-body .KuxModalHeader-close {
    top: 28px;
  }

  .MuiPaper-root {
    width: 100%;
    max-width: 680px;
    padding: 0;
    border-radius: 16px;
  }
`;

export const StyledMDrawer = styled(MDrawer)`
  width: 100vw;
  left: 0;

  .KuxModalHeader-root {
    height: auto;
    padding-top: ${({ isApp }) => (isApp ? '100px' : '60px')};
    /* padding-top: 60px; */
    padding-bottom: 12px;
    border: none;
  }

  .KuxModalHeader-root .KuxModalHeader-close {
    top: ${({ isApp }) => (isApp ? '52px' : '12px')};
    left: 16px;
  }

  .KuxModalHeader-title {
    width: 100%;
    font-size: 20px;
  }
  .KuxDrawer-content {
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

export const SubText = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text40};
  /* ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 16px;
  } */
`;

export const MainWrapper = styled.div`
  max-height: calc(100vh - 200px);
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    max-height: fit-content;
    padding: 0 16px 32px;
    /* min-height: 100vh;
    overflow-x: hidden; */
  }
`;

export const Section = styled.div`
  /* margin: 32px 32px 0 32px; */
  margin-top: 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 20px 0;
  }
`;

export const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 4px;
  }
`;

export const SectionDesc = styled.div`
  color: #bbb;
  font-size: 13px;
  margin-bottom: 16px;
`;

export const TipsComponent = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 13px;
  line-height: 1.4;
  font-weight: 400;
  width: max-content;
  display: flex;
  /* width: 100%; */
  /* min-width: 100%; */
  justify-content: flex-end;
  text-align: right;
  line-height: 28px;
`;

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledATag = styled.a`
  font-size: 14px;
  cursor: pointer;
  /* margin-left: 8px; */
  margin-left: 24px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const ActionLink = styled(StyledATag)`
  text-decoration: underline;
  font-weight: 700;
  text-underline-offset: 2px;
  margin-left: 0;
`;

export const Footer = styled.div`
  font-size: 14px;
  padding: 24px 0 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const CommonTableText = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  min-width: max-content;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const FirstColumn = styled.div`
  display: flex;
`;

export const WarnTag = styled.div`
  background-color: ${({ theme }) => theme.colors.complementary8};
  color: ${({ theme }) => theme.colors.complementary};
  display: flex;
  padding: 2px 4px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  border-radius: 6px;
  min-width: fit-content;
`;

export const ActionColumnWithCount = styled.div`
  display: flex;
  align-items: center;
`;

export const CountTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.cover4};
  color: ${({ theme }) => theme.colors.text100};
  font-weight: 700;
  line-height: 1.4;
  font-size: 12px;
  padding: 5.5px 12px;
  width: max-content;
`;
