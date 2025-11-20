/**
 * Owner: garuda@kupotech.com
 * 公共样式
 */
import TooltipWrapper from '@/components/TooltipWrapper';
import { styled } from '@/pages/Futures/import';

export const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24px;
`;

export const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.cover2};
  .result-item {
    &:not(:last-of-type) {
      margin-bottom: 12px;
    }
  }
`;

export const ResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ResultLabel = styled.div`
  display: flex;
  justify-content: ${(props) => (props.title ? 'flex-end' : 'flex-start')};
  flex: 1;
  width: ${(props) => (props.title ? '26%' : '35%')};
  max-width: ${(props) => (props.title ? '26%' : '35%')};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
  white-space: normal;
  word-break: break-word;
  text-align: ${(props) => (props.title ? 'right' : 'left')};
  > span {
    color: ${(props) => props.theme.colors.text40};
  }
  &.result-label {
    &:last-of-type {
      margin-right: 12px;
    }
  }
`;

export const ResultItemValue = styled.div`
  display: flex;
  justify-content: flex-end;
  max-width: 26%;
  width: 26%;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => (props.value ? props.theme.colors.text : props.theme.colors.text30)};
  text-align: right;
  white-space: normal;
  word-break: break-word;
`;

export const TooltipClx = styled(TooltipWrapper)`
  text-decoration: underline dashed ${(props) => props.theme.colors.text20};
`;
