/*
 * @owner: borden@kupotech.com
 */
import { styled, Form } from '@kux/mui';
import SwapIcon from '../../components/SwapIcon';

export const StyledForm = styled(Form)`
  position: relative;
  margin-top: 14px;
  .KuxForm-itemError {
    padding-left: 0;
    font-size: 12px;
    font-weight: 400;
    line-height: 130%;
  }
`;

export const Container = styled.div`
  padding: 16px 20px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.cover4};
`;

export const Header = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.text60};
`;

export const MarketPrice = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.colors.text30};
`;

export const PricePrefix = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: ${(props) => props.theme.colors.text40};
`;

export const Unit = styled.span`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
`;

export const DangerAlert = styled.div`
  color: #f00;
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  margin-top: 2px;
  padding: 0 20px;
  line-height: 16px;
`;

export const StyledSwapIcon = styled(SwapIcon)`
  margin-left: 4px;
  cursor: pointer;
`;
