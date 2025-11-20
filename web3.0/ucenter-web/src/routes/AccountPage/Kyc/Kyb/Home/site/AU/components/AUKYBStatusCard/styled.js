/**
 * Owner: tiger@kupotech.com
 */
import { ICCopyOutlined, ICReceivedOutlined } from '@kux/icons';
import { Alert, Button as OriginButton, Divider, styled, Tag } from '@kux/mui';

export const DownloadIcon = styled(ICReceivedOutlined)`
  font-size: 20px;
`;
export const CopyIcon = styled(ICCopyOutlined)`
  font-size: 20px;
`;
export const DownloadButton = styled(OriginButton)`
  width: fit-content;
  gap: 4px;
  .downloadText {
    text-decoration: underline;
  }
`;
export const ExButton = styled(OriginButton)`
  display: flex;
  gap: 4px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;
export const ReAlert = styled(Alert)`
  margin-bottom: 24px;
`;
export const ReTag = styled(Tag)`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  padding: 2px 8px;
`;
export const WholesaleDetailWrapper = styled.section`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 180%;
  color: ${({ theme }) => theme.colors.text60};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 48px;
  .title {
    b {
      font-weight: 500;
    }
  }
  .listItem {
    display: flex;
    &::before {
      display: flex;
      flex-shrink: 0;
      width: 4px;
      height: 4px;
      margin: 12px 12px 0;
      background-color: ${({ theme }) => theme.colors.text60};
      border-radius: 50%;
      content: '';
    }
  }
`;

export const StatusWrapper = styled.section`
  .companyName {
    margin-bottom: 16px;
    font-weight: 700;
    font-size: 26px;
    font-style: normal;
    line-height: 130%;
  }
  .countryInfo {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 140%;
    ${({ theme }) => theme.breakpoints.down('lg')} {
      margin-bottom: 24px;
      .countryInfoTip {
        display: none;
      }
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-bottom: 16px;
    }
  }
  .statusList {
    display: flex;
    flex-direction: column;
  }
  .statusItem {
    margin-bottom: 40px;
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.colors.divider8};
    border-radius: 20px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding: 20px;
    }
  }
  .statusItemMb24 {
    margin-bottom: 24px;
  }
  .titleBox {
    display: flex;
    gap: 12px;
  }
  .titleIndex {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 23px;
    height: 23px;
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.textEmphasis};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 140%;
    background-color: ${({ theme }) => theme.colors.text};
    border-radius: 12px;
  }
  .titleTextBox {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }
  .statusItemTitle {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 20px;
    font-style: normal;
    line-height: 140%;
  }
  .emailBox {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }
  .emailTip {
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 140%;
  }
  .email {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 140%;
    text-decoration: underline;
  }
  .cardList {
    display: flex;
    align-items: stretch;
  }
  .viewDetail {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    line-height: 140%;
    text-decoration: underline;
    cursor: pointer;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    .cardList {
      flex-direction: column;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .companyName {
      font-size: 20px;
    }
    .statusItem {
      margin-bottom: 24px;
    }
    .emailBox {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
  }
`;
export const Divider1 = styled(Divider)`
  margin-top: 24px;
  margin-bottom: 12px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin-top: 24px;
    margin-bottom: 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 24px;
    margin-bottom: 12px;
  }
`;
export const Divider2 = styled(Divider)`
  margin-top: 24px;
  margin-bottom: 24px;
`;
export const Divider3 = styled.div`
  display: flex;
  margin: 0 24px;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text60};
  &::before,
  &::after {
    display: flex;
    flex: 1;
    width: 1px;
    background-color: ${({ theme }) => theme.colors.divider8};
    content: '';
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: row;
    margin: 24px 0;
    &::before,
    &::after {
      width: auto;
      height: 1px;
    }
  }
`;
export const StatusAlert = styled(Alert)`
  padding: 0;
  background-color: transparent;
  margin-top: 4px;
  .KuxAlert-icon {
    margin-top: 0;
  }
`;
export const StatusCardWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  .cardHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    b {
      font-weight: 500;
      font-size: 18px;
      font-style: normal;
      line-height: 140%;
    }
  }
  .UnlockEl {
    flex: 1;
  }
  .UnlockHeader {
    flex-direction: column;
  }
`;
