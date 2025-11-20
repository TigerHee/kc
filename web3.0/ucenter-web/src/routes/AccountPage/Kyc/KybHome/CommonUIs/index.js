/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICAuthenticationOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { ReactComponent as ArrowRightIcon } from 'static/account/kyc/index/arrow_right.svg';

export const Wrapper = styled.div`
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
    margin-bottom: 24px;
    padding: 16px;
  }
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
export const TopRightBox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
export const KYBIcon = styled(ICAuthenticationOutlined)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.text};
  @media screen and (max-width: 767px) {
    width: 16px;
    height: 16px;
  }
`;
export const KYBDesc = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 2px 0 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
export const ArrowIcon = styled(ArrowRightIcon)`
  width: 16px;
  height: 16px;
  [dir='rtl'] & {
    transform: rotateY(180deg);
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
