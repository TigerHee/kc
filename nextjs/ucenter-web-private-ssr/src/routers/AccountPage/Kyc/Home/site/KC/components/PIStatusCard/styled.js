import { Divider as OriginDivider, Steps, styled, Tag } from '@kux/mui';

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  margin-bottom: 0;
`;

export const ColumnBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 8 }) => gap}px;
  width: 100%;
`;

export const RowBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ gap = 8 }) => gap}px;
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'initial')};
`;

export const Region = styled(RowBox)`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  & > div:nth-child(2) {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;

export const RegionIcon = styled.img`
  width: 15px;
  height: 10px;
`;

export const ExSteps = styled(Steps)`
  width: 580px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    width: auto;
  }
  .KuxStep-stepContent {
    flex: 1;
    margin-bottom: 24px;
    margin-left: 8px;
  }
  .KuxStep-content {
    margin-top: 12px;
  }
  .KuxStep-icon {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }
  .KuxStep-waitStep .KuxStep-icon {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background-color: ${({ theme }) => theme.colors.text30};
    border-color: ${({ theme }) => theme.colors.text30};
  }
  .KuxStep-processStep .KuxStep-icon,
  .KuxStep-finishStep .KuxStep-icon {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background-color: ${({ theme }) => theme.colors.text};
  }
  .KuxStep-step {
    overflow: initial;
    &:last-child .KuxStep-stepContent {
      margin-bottom: 12px;
    }
  }
  .KuxStep-tail {
    left: 10px;
  }
  .KuxStep-tail:after {
    width: 0;
    background: none;
    border-right: 1px dashed ${({ theme }) => theme.colors.cover16};
  }
`;

export const Divider = styled(OriginDivider)`
  margin: 0;
  height: 0.5px;
`;

export const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  > span > span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;

export const CertTitle = styled(RowBox)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
  gap: 4px;
  flex-wrap: wrap;
`;

export const ExTag = styled(Tag)`
  line-height: 140%;
  border-radius: 6px;
`;

export const VerifyingAlert = styled(ColumnBox)`
  color: ${({ theme }) => theme.colors.complementary};
  font-size: 15px;
  font-weight: 500;
  line-height: 140%; /* 21px */
  & > div:nth-child(2) {
    font-weight: 400;
    font-size: 14px;
  }
`;

export const RejectedAlert = styled(ColumnBox)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 15px;
  font-weight: 500;
  line-height: 140%; /* 21px */
  & > ul:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 1.5em;
    font-weight: 400;
    font-size: 14px;
    list-style-type: decimal;
  }
`;
