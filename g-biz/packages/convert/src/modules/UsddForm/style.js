/*
 * @owner: june.lee@kupotech.com
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
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 12px;
  }
`;

export const FlexBox = styled.div`
  display: flex;
  align-items: center;
`;

export const MarketPrice = styled(FlexBox)`
  font-size: 14px;
  line-height: 130%;
  margin-top: 16px;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.text40};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

export const TooltipContent = styled.span`
  cursor: help;
  margin-left: 2px;
  display: inline-flex;
`;

export const StyledSwapIcon = styled(SwapIcon)`
  margin-left: 4px;
  cursor: pointer;
`;

export const ConvertLimit = styled.div`
  display: flex;
  height: 18px;
  justify-content: flex-start;
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  cursor: pointer;
`;
