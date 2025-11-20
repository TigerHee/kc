import { ICArrowRight2Outlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { AntiBox } from '../styled';

export const Container = styled.main`
  background: #121212;
  display: flex;
  flex-direction: column;
`;
export const Header = styled.div`
  color: #f3f3f3;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 130%; /* 23.4px */
  padding: 10px 16px;
`;
export const Back = styled(ICArrowRight2Outlined)`
  position: absolute;
  top: 12px;
  left: 16px;
  cursor: pointer;
  transform: scaleX(-1);
`;

export const ScoreBox = styled.div`
  padding: 0 16px;
  padding-top: ${({ noSuggest, headerHidden }) => (noSuggest ? (headerHidden ? 96.5 : 64) : 16)}px;
`;

export const ScoreBrow = styled.div`
  color: rgba(243, 243, 243, 0.6);
  font-size: 13px;
  font-weight: 400;
  line-height: 140%; /* 18.2px */
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const ExAntiBox = styled(AntiBox)`
  transform: translateX(calc((100vw - 32px - 375px) / 2));
  & > div:first-child {
    transform: translateY(-18px);
  }
`;

export const ValueBox = styled.div`
  text-align: center;
  font-size: 48px;
  font-weight: 700;
  line-height: 140%; /* 67.2px */
  width: 100%;
  position: absolute;
  top: 91px;
`;

export const ScoreTitle = styled.div`
  line-height: 140%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  & > div:first-child {
    color: #f3f3f3;
    font-weight: 500;
    font-size: 22px;
  }
  & > div:nth-child(2) {
    color: rgba(243, 243, 243, 0.6);
    font-weight: 400;
    font-size: 16px;
  }
`;

export const NoSuggestBox = styled.div`
  flex: 1;
  color: rgba(243, 243, 243, 0.4);
  display: flex;
  align-items: flex-end;
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  line-height: 140%; /* 18.2px */
  padding: 12px 16px;
`;

export const SuggestBox = styled.div`
  margin-top: 40px;
  flex: 1;
  background: ${({ theme, isDark }) => (isDark ? 'inherit' : theme.colors.background)};
  align-items: center;
  border-radius: 20px 20px 0 0;
`;

export const SuggestList = styled.div`
  border-radius: 20px;
  padding: 22px 16px 32px;
  background: ${({ theme }) => theme.colors.layer};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SuggestTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 500;
  line-height: 140%; /* 21px */
  min-height: 26px;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 4px;
  & > span {
    text-align: center;
  }
  .left-wing {
    position: absolute;
    top: 0;
    left: -92px;
  }
  .right-wing {
    position: absolute;
    top: 0;
    right: -92px;
  }
`;

export const SuggestItem = styled.div`
  margin-top: 16px;
  display: flex;
  padding: 18px 16px 20px;
  align-items: center;
  gap: 16px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  width: 100%;
`;

export const SuggestItemLeft = styled.div`
  flex: 1;
  & > div:first-child {
    display: flex;
    gap: 6px;
    align-items: center;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    line-height: 140%;
    ems: center;
  }
  & > div:nth-child(2) {
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
    in-top: 6px;
  }
  & > div:nth-child(3) {
    display: flex;
    gap: 6px;
    margin-top: 10px;
  }
`;

export const SuggestFooter = styled.div`
  padding: 40px 16px ${({ isInApp }) => (isInApp ? 36 : 12)}px;
  color: ${({ theme }) => theme.colors.text40};
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  line-height: 140%; /* 18.2px */
`;
