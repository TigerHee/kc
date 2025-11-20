import { styled } from '@kux/mui';
import { AntiBox } from '../styled';

export const Container = styled.main`
  margin: 26px 64px 0;
`;

export const Back = styled.div`
  display: flex;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
  align-items: center;
  cursor: pointer;
  width: fit-content;
`;

export const Card = styled.div`
  background: ${({ isDark }) => (isDark ? '#222223' : '#121212')};
  display: flex;
  align-items: center;
  border-radius: 20px;
  ${({ dir }) => {
    if (dir === 'row') {
      return `
        padding: 7px 18px 21px;
        gap: 44px;
      `;
    } else {
      return `
        padding: 56px 0 24px;
        gap: 20px;
        flex-direction: ${dir};
      `;
    }
  }};
`;
export const ExAntiBox = styled(AntiBox)`
  & > div:first-child {
    transform: translate(2px, -17px);
  }
`;
export const CardNum = styled.div`
  text-align: center;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 67.2px */
  position: absolute;
  top: 78px;
  width: 100%;
`;
export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ center }) => (center ? 'center' : 'flex-start')};
`;
export const CardFooter = styled.div`
  color: rgba(243, 243, 243, 0.4);
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  line-height: 140%; /* 18.2px */
`;

export const Title = styled.div`
  color: #f3f3f3;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 44.8px */
`;

export const Desc = styled.div`
  color: rgba(243, 243, 243, 0.6);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 25.2px */
  margin-top: 8px;
`;

export const Content = styled.div`
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const ContentTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 500;
  line-height: 140%; /* 28px */
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
`;

export const ContentFooter = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  line-height: 140%; /* 18.2px */
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Item = styled.div`
  display: flex;
  padding: 32px 24px;
  align-items: center;
  gap: 48px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
`;

export const ItemLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  & > div:first-child {
    display: flex;
    gap: 6px;
    gap: 6px;
    align-items: center;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 18px;
    line-height: 140%;
  }
  & > div:nth-child(2) {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%; /* 25.2px */
  }
`;

export const ItemStars = styled.div`
  display: flex;
  gap: 6px;
`;
