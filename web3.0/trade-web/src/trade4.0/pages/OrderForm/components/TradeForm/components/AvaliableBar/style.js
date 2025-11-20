/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';
import TooltipWrapper from '@/components/TooltipWrapper';
import SvgComponent from '@/components/SvgComponent';
import DropdownSelect from '@/components/DropdownSelect';
import dropStyle from '@/components/DropdownSelect/style';

export const CenterBox = styled.div`
  display: flex;
  align-items: center;
`;

export const Container = styled(CenterBox)`
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const Label = styled(CenterBox)`
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.colors.text40};
  justify-content: space-between;
  margin-right: 8px;
`;

export const Avaliable = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.colors.text};
`;

export const StyledTooltipWrapper = styled(TooltipWrapper)`
  font-size: 12px;
  line-height: unset;
  color: ${props => props.theme.colors.text40};
`;

export const OverlayLabel = styled.span`
  margin-left: 8px;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${props => props.theme.colors.text};
`;

export const StyledDropdownSelect = styled(DropdownSelect)`
  .dropdown-value {
    padding: 0px;
  }
`;

export const DropdownLabelIcon = styled(SvgComponent)`
  margin-left: 2px;
`;

export const DropdownExtend = {
  List: styled(dropStyle.List)`
    .dropdown-item {
      display: flex;
      align-items: center;
      color: ${props => props.theme.colors.icon};
    }
  `,
};

export const TooltipContent = styled.div`
  font-size: 12px;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: 264px;
  }
`;

export const TooltipTitle = styled.div`
  color: ${props => props.theme.colors.text60};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
    line-height: 130%;
  }
`;

export const TooltipBody = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
    line-height: 130%;
  }
`;

export const TooltipBodyLabel = styled.span`
  color: ${props => props.theme.colors.text40};
`;

export const TooltipBodyValue = styled.span`
  flex-shrink: 0;
  margin-left: 8px;
  color: ${props => props.theme.colors.text};
`;

