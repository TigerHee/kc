/**
 * Owner: vijay.zhou@kupotech.com
 * 可复用的ui组件
 */
import { Button, styled } from '@kux/mui';

export const KYC3Wrapper = styled.div`
  padding-bottom: 64px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding-bottom: 0;
  }
`;
export const TopLayout = styled.div`
  width: 100%;
  box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 24px 64px;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 17px 0;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin-bottom: 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 12px 0;
    margin-bottom: 12px;
    padding: 16px;
  }
`;

export const TransferTipsLayout = styled.div`
  position: relative;
  padding: 12px 16px;

  display: flex;
  /* align-items: baseline; */
  gap: 16px;
  border-radius: 8px;
  font-size: 14px;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.text60};
  margin: 32px 64px;
  /* line-height: 28px; */
  background: ${({ theme }) => theme.colors.complementary8};
  @media screen and (max-width: 1199px) {
    margin: 32px;
  }
  @media screen and (max-width: 767px) {
    margin: 16px;
    padding: 12px;
  }
`;

export const TransferTipsContent = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  padding-left: 28px;
  padding-right: 28px;
  line-height: 140%;
  align-items: baseline;
  flex-wrap: wrap;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
  }
`;

export const Description = styled.div`
  display: flex;
  gap: 8px;
`;

export const TransferButton = styled(Button)`
  width: fit-content;
  font-size: 12px;
  height: 28px;
  line-height: 28px;
`;

export const TopLeftBox = styled.div`
  flex: 1;
  min-width: 300px;
`;
export const TopLeftTitle = styled.h3`
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 18px;
    line-height: 130%;
  }
`;
export const MainLayout = styled.div`
  display: flex;
  @media screen and (max-width: 1199px) {
    display: block;
  }
  margin: auto;
  width: 100%;
  padding: 0 64px;
  @media screen and (max-width: 1199px) {
    padding: 0 32px;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    min-width: auto;
    max-width: 767px;
    margin-top: 20px;
    padding-right: 16px;
    padding-left: 16px;
  }
`;
export const MainLeftBox = styled.div`
  flex: 1;
  flex-shrink: 0;
  margin-right: 64px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    margin-right: 40px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin-right: 0;
    margin-bottom: 28px;
  }
`;
export const MainRightBox = styled.div`
  width: 460px;
  flex-shrink: 0;
  @media screen and (max-width: 1679px) {
    width: 404px;
  }
  @media screen and (max-width: 1439px) {
    width: 250px;
  }
  @media screen and (max-width: 1199px) {
    width: unset;
    margin-bottom: 80px;
  }
  @media screen and (max-width: 375px) {
    width: unset;
    margin-bottom: 40px;
  }
`;

export const KycStatusCardWrapper = styled.div`
  margin-bottom: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;
