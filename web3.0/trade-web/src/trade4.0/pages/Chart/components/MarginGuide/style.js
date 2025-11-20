/**
 * Owner: borden@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import ScrollWrapper from '@/components/ScrollWrapper';
import TooltipWrapper from '@/components/TooltipWrapper';

export const Wrapper = styled.div`
  ${fx.height(36)}
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.justifyContent('space-between')}
  ${fx.padding('8px 16px')}
  ${fx.fontSize(12)}
  ${fx.fontWeight(500)}
  ${fx.lineHeight(20)}
  ${(props) => fx.color(props, 'text')}
  background: ${(props) => props.theme.colors.cover4};
  white-space: nowrap;
  ${(props) => props.theme.breakpoints.up('lg')} {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const Left = styled(ScrollWrapper)`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  overflow-x: auto;
  overflow-y: hidden;
  margin-right: 16px;

  .title {
    ${(props) => fx.color(props, 'text40')}
    ${fx.marginRight(16)}
  }
  .guides {
    ${fx.display('flex')}
    ${fx.alignItems('center')}
    flex: 1;
  }
`;

export const Right = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
`;

export const ActionWrapper = styled.a`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  color: ${(props) => props.theme.colors.text60};
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
  svg {
    ${fx.marginRight(4)}
  }
`;

export const NodeDivider = styled.div`
  display: flex;
  align-items: center;
  width: 36px;
  position: relative;
  margin: 0 8px;
  justify-content: space-between;

  > div {
    margin: 0 6px;
    width: 24px;
    height: 0;
    border-top: 1px dashed ${(props) => props.theme.colors.icon40};
  }
  &:before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: ${(props) => props.theme.colors.icon40};
    position: absolute;
    left: 0;
    top: calc(50% - 2px);
    z-index: 1;
  }

  &:after {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: ${(props) => props.theme.colors.icon40};
    position: absolute;
    right: 0;
    top: calc(50% - 2px);
    z-index: 1;
  }
`;

export const StyledTooltipWrapper = styled(TooltipWrapper)`
  line-height: 16px;
  ${fx.fontSize(12)}
  ${fx.fontWeight(500)}
  ${fx.lineHeight(16)}
  color: ${(props) => props.theme.colors.text};
`;

export const MaxTooltip = styled.div`
  ${fx.maxWidth(216)}
`;

export const TipItem = styled.div``;

export const Operation = styled.div`
  ${fx.display('flex')}
  margin-top: 6px;
  .textBtn {
    ${(props) => fx.color(props, 'textPrimary')}
    cursor: pointer;
    ${fx.marginRight(16)}
  }
`;
