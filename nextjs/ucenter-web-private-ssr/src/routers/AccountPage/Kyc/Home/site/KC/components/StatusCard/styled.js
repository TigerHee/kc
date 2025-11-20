import { Divider as OriginDivider, styled } from '@kux/mui';

export const ColumnBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 8 }) => gap}px;
  align-items: center;
  width: 100%;
  .infoHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 4px;
  }
  .infoHeaderLabel {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    line-height: 140%;
  }
  .infoItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 40px;
  }
  .infoLabel {
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
  }
  .infoValue {
    display: flex;
    gap: 4px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
  }
  .infoEdit {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const Container = styled(ColumnBox)`
  padding: 0 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

export const RowBox = styled.div`
  display: flex;
  gap: ${({ gap = 8 }) => gap}px;
`;

export const Icon = styled.img`
  width: 136px;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  margin-bottom: 0;
`;

export const Desc = styled.div`
  color: ${({ theme, small }) => (small ? theme.colors.text40 : theme.colors.text60)};
  font-size: ${({ small }) => (small ? 14 : 16)}px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  display: flex;
  gap: 4px;
  text-align: center;
`;

export const HelpItem = styled.a`
  display: flex;
  gap: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  svg {
    margin-top: 3px;
  }
`;

export const FailedList = styled.ul`
  width: 100%;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  ${({ onlyOne }) => {
    return !onlyOne
      ? `
      list-style-type: decimal;
      padding-left: 1em;
    `
      : '';
  }}
`;

export const Divider = styled(OriginDivider)`
  margin: 0;
  height: 0.5px;
`;
