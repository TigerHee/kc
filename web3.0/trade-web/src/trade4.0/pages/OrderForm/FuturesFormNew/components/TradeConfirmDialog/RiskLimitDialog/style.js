/**
 * Owner: garuda@kupotech.com
 */

import { styled } from '@kux/mui/emotion';

import KuxAlert from '@mui/Alert';
import KuxButton from '@mui/Button';

import { PrettyCurrency, SymbolText } from '../../../builtinComponents';

export const PrettyCurrencyColor = styled(PrettyCurrency)`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => (props.primary ? props.theme.colors.primary : props.theme.colors.text)};
  .unit {
    color: ${(props) => props.theme.colors.text40};
  }
`;

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.3;
  > h3 {
    margin: 0 0 4px;
    font-size: 24px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.text};
  }
`;

export const SymbolTextWrapper = styled(SymbolText)`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
`;

export const Alert = styled(KuxAlert)`
  &.alert-info {
    margin: 0 0 24px;
  }
`;

export const Button = styled(KuxButton)``;

export const DialogInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > div {
    width: 100%;
  }
  .info {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    color: ${(props) => props.theme.colors.text60};
  }
`;

export const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0 12px;
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
  color: ${(props) => (props.primary ? props.theme.colors.primary : props.theme.colors.text)};
  text-align: right;
  white-space: normal;
  word-break: break-word;
`;
