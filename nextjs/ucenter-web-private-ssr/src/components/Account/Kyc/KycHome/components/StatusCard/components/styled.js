/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Button as OriginButton, styled } from '@kux/mui';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 24px;
  }
`;
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 8px 32px 28px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
`;

export const Img = styled.img`
  display: block;
  margin: 0 auto;
  width: 136px;
  height: 136px;
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
`;

export const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  b {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Button = styled(OriginButton)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Gap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ distance = 0 }) => distance}px;
  width: 100%;
`;
