/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';
import Dialog from '@mui/Dialog';
import TooltipWrapper from '@/components/TooltipWrapper';
import { withYScreen } from '@/pages/OrderForm/config';

const CenterBox = styled.div`
  display: flex;
  align-items: center;
`;
export const Container = withYScreen(styled(CenterBox)`
  justify-content: space-between;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  margin-top: 10px;
  ${props => props.$useCss(['md', 'sm'])(`
    margin-top: 5px;
  `)}
`);
export const SettingInfo = styled(CenterBox)`
  color: ${props => props.theme.colors.text60};
`;
export const SettingLabel = styled(CenterBox)`
  margin-right: 2px;
  color: ${props => props.theme.colors.text40};
`;
export const StyledTooltipWrapper = styled(TooltipWrapper)`
  color: ${props => props.theme.colors.text};
`;
export const ModalTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;

export const StyledTooltipWrapperForTitle = styled(TooltipWrapper)`
  font-size: 12px;
  color: ${props => props.theme.colors.text40};
`;

export const StyledDeleteTooltipWrapper = styled(TooltipWrapper)`
  cursor: pointer;
  margin-left: 4px;
  color: ${props => props.theme.colors.icon60};
  &:hover {
    color: ${props => props.theme.colors.icon};
  }
`;
export const StyledDialog = styled(Dialog)`
  .rc-picker-input input {
    height: 38px;
    padding-top: 0;
    padding-bottom: 0;
  }
`;

export const Label = styled.div`
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

export const SettingButton = styled.a`
  color: ${props => props.theme.colors.text60};
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;
export const DropdownSpan = styled.div`
  display: flex;
  width: 100%;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.cover4};
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  margin-top: 5px;
  .dropdown-value {
    padding-left: 4px;
  }
`;
