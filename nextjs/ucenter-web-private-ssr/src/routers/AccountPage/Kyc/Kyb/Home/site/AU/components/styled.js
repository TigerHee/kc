import { styled } from '@kux/mui';
import {
  PADDING_LG,
  PADDING_XL,
  PADDING_XS,
} from 'src/components/Account/Kyc/constants/paddingSize';

export const Container = styled.div`
  .topBox {
    align-items: center;
  }
  .backBox {
    padding: 0 ${PADDING_XL}px;
    ${({ theme }) => theme.breakpoints.down('lg')} {
      padding: 0 ${PADDING_LG}px;
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding: 0 ${PADDING_XS}px;
    }
  }
  .backContent {
    max-width: 808px;
    margin: 0 auto;
  }
  .BackBtnWrapper {
    margin-left: 0;
  }
`;
export const Header = styled.div`
  padding: 28.5px ${PADDING_XL}px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 28.5px ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: ${PADDING_XS}px;
  }
  .headerContent {
    width: 100%;
    max-width: 808px;
    margin: 0 auto;
    &.maxWidth640 {
      max-width: 640px;
    }
  }
`;
export const VerifyRegion = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  display: flex;
  gap: 12px;
  & :nth-child(odd) {
    color: ${({ theme }) => theme.colors.text40};
  }
  & :nth-child(even) {
    display: flex;
    gap: 8px;
    align-items: center;
    img {
      width: 24px;
      height: 16px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
    line-height: 130%;
  }
`;
export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px ${PADDING_XL}px;
  &.maxWidth {
    max-width: 640px;
    margin: 0 auto;
    padding: 40px 0;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    padding: 24px ${PADDING_LG}px 32px;
    &.maxWidth {
      padding: 24px 0;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${PADDING_XS}px;
    &.maxWidth {
      padding: ${PADDING_XS}px;
    }
  }
  .layoutContent {
    width: 100%;
    max-width: 808px;
    margin: 0 auto;
    &.maxWidth640 {
      max-width: 640px;
    }
  }
`;
export const LayoutLeft = styled.div`
  flex: 1 1 780px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex: none;
  }
`;
export const LayoutRight = styled.div`
  flex: 1 1 404px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex: none;
  }
`;
