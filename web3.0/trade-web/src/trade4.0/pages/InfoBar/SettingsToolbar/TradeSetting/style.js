/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';
import ArrowRight from '@/assets/toolbar/arrow-right.svg';
import SvgComponent from '@/components/SvgComponent';
import Box from '@mui/Box';
import KuxDivider from '@mui/Divider';
import Drawer from '@mui/Drawer';

export const DrawerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: ${(props) => props.width || '100%'};
  transition: 0.3s all ease;
  position: relative;
`;

export const DrawerContent = styled.div`
  width: 100%;
  flex: 1;
  overflow: auto;
  padding: ${(props) => props.padding};
  position: relative;
`;

export const DrawerFooter = styled.footer`
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 32px;
  box-sizing: border-box;
  border-top: 1px solid ${(props) => props.theme.colors.cover4};

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
    button {
      width: 100%;
    }
  }
`;

export const SettingsItem = styled.a`
  align-items: center;
  cursor: pointer;
  display: flex;
  padding: 14px 32px;
  ${(props) => (props.itemAlign ? `display: flex; item-align: ${props.itemAlign};` : '')}

  &:first-of-type {
    margin-top: ${(props) => (props.hasMargin ? '24px' : '0')};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.cover4};
  }

  &::after {
    content: '';
    width: ${(props) => (props.noIcon ? '0px' : '16px')};
    height: ${(props) => (props.noIcon ? '0px' : '16px')};
    display: block;
    transform: rotate(0deg);
    background: ${(props) => {
      return props.noIcon ? 'none' : `url(${ArrowRight}) no-repeat center center`;
    }};
    background-size: 100%;
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 14px 16px;
  }
`;

export const SettingsItemIcon = styled(SvgComponent)`
  color: ${(props) => props.theme.colors.icon};
  width: 20px;
  height: 20px;
`;

export const SettingsItemText = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  margin-left: ${(props) => props.marginLeft || '12px'};
  margin-right: auto;
  ${(props) => (props.flex ? 'flex: 1;' : '')}
`;

export const SettingsItemTip = styled.span`
  align-items: center;
  background: ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  font-size: 12px;
  height: 16px;
  justify-content: center;
  width: 16px;
`;

export const SettingsItemSwitch = styled.span`
  align-items: center;
  height: 20px;
`;

export const SelectLabel = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text60};
  margin: 0 0 6px;
`;

export const SelectVoiceItem = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .listening {
    display: none;
  }

  :hover {
    .listening {
      display: block;
    }
  }
`;

export const TableItem = styled.div`
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 0 0 32px;
  color: ${(props) => (props.gray ? props.theme.colors.text60 : props.theme.colors.text)};
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;

  > * {
    flex: 1;
  }

  svg {
    cursor: pointer;
    display: none;
    color: ${(props) => props.theme.colors.icon};

    &:hover {
      color: ${(props) => props.theme.colors.text};
    }
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.cover4};
    svg {
      display: inline-block;
    }
  }
`;

export const BoxWrapper = styled(Box)`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};

  [role='tablist'] {
    margin-left: 32px;
  }

  .KuxTabs-container {
    height: 48px;
  }
`;

export const TabWrapper = styled(Box)`
  .KuxModalHeader-close {
    top: 50%;
    transform: translate(0, -50%);
  }

  [role='tablist'] {
    height: 88px;
  }

  .KuxTabs-container {
    height: 88px;
  }
`;

export const TableItemRight = styled.span`
  text-align: right;
`;

export const CloseWrapper = styled.span`
  width: 32px;
  flex: none !important;
  text-align: center;
`;

export const LogItem = styled.div`
  padding: 16px 32px;
  border-bottom: 1px solid ${(props) => props.theme.colors.cover4};
`;

export const LogItemTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

export const LogItemTime = styled.span`
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;

export const SubTitle = styled.h4`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin: 0px;
  padding-left: 32px;
  margin-top: ${(props) => props.marginTop || '8px'};
  margin-bottom: 8px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

export const CurrentFuturesTitle = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-right: 8px;
`;

export const FuturesContentWrapper = styled.div`
  width: 100%;
  padding: 24px 32px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
  }
`;

export const CurrentFuturesRow = styled.div`
  margin-bottom: 20px;
`;

export const CurrentFuturesLabel = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-right: 8px;
`;

export const CurrentFuturesValue = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

export const RiskLimitSelect = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 0;
`;

export const RiskLimitRow = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 0;
  &.sub-row {
    padding: 12px 0;
    margin-bottom: 12px;
  }
`;

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
  .amount {
    font-weight: 500;
  }
  .value {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 500;
  }
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
`;

export const RiskTableContent = styled.div``;

export const ButtonContent = styled.div``;

export const RiskDescription = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-top: 16px;
`;

export const AlertDescription = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-bottom: 24px;
`;

export const PopTitle = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const PopDescription = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-bottom: 12px;
`;

export const RowDescription = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-top: 8px;
`;

export const AllButton = styled.div`
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  &.all-button {
    margin-top: 12px;
  }
`;

export const Divider = styled(KuxDivider)`
  margin: 16px 0;
`;

export const RiskDivider = styled(KuxDivider)`
  margin: 16px 0 24px;
`;

export const FuturesButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  padding: 20px 32px;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.colors.cover4};
  background-color: ${(props) => props.theme.colors.layer};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
  }
`;

export const TipsBox = styled.div`
  margin: 24px 0 0;
  .KuxCheckbox-wrapper {
    &::after {
      display: none;
    }
  }
`;

export const DrawerCls = styled(Drawer)`
  .KuxModalHeader-title {
    max-width: 400px;
    white-space: normal;
  }
`;
