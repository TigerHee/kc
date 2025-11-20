/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';
import TooltipWrapper from '@/components/TooltipWrapper';
import { withYScreen } from '@/pages/OrderForm/config';

export const Container = withYScreen(styled.div`
  padding-top: 4px;
  /* padding-bottom: 2px; */
  ${props => props.$useCss(['md', 'sm'])(`
    padding-top: 0px;
    padding-bottom: 0px;
  `)}
`);

export const Row = withYScreen(styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  margin-top: 6px;
  ${props => props.$useCss(['md', 'sm'])(`
    margin-top: 5px;
  `)}
`);

export const StyledTooltipWrapper = styled(TooltipWrapper)`
  font-size: 12px;
  color: ${props => props.theme.colors.text40};
`;

export const Value = styled.div`
  color: ${props => props.theme.colors.text};
  text-align: right;
  margin-left: 8px;
`;

export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;
