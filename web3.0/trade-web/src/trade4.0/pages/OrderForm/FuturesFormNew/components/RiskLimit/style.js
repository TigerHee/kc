/**
 * Owner: garuda@kupotech.com
 * 风险限额过低样式
 */

import { styled } from '../../builtinCommon';

export const RiskLimitTitle = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-bottom: 4px;
`;

export const RiskSelectContent = styled.div`
  margin-bottom: 20px;
`;

export const RiskTableHeaderWrapper = styled.div`
  display: flex;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  padding-bottom: 8px;
`;

export const RiskTableItem = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 4px;
  margin-bottom: 8px;
`;

export const RiskTableItemTitle = styled.div`
  padding-left: 12px;
  flex: 1;
`;

export const RiskTableItemBefore = styled.div`
  width: 88px;
  text-align: center;
  color: ${(props) => props.theme.colors[props.color || 'text40']};
`;

export const RiskTableItemAfter = styled.div`
  width: 88px;
  text-align: right;
  padding-right: 12px;
  .value {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const RiskTableContent = styled.div``;

export const DialogContent = styled.div``;

export const RiskDescription = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-top: 16px;
`;
