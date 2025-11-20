/*
 * owner: Clyne@kupotech.com
 */
import { fx, styled, withMedia } from '@/style/emotion';
import { FlexColumm, TextOverFlow } from '@/style/base';
import { name } from '@/pages/Orderbook/config';

const HOC = (FC) => withMedia(name, FC);

// bar
const wrapperMd = () => `
  display: none;
`;

export const Wrapper = HOC(styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.padding('10px 12px')}
  ${({ $media }) => $media('md', wrapperMd())}

  & .bar-left {
    ${fx.display('flex')}
    ${fx.alignItems('center')}
  }
`);

export const PriceContent = styled(FlexColumm)`
  ${fx.justifyContent('center')}
`;

export const Center = styled.span`
  ${fx.lineHeight(16)}
  ${(props) => {
    return fx.color(props, props.hasValue ? 'text' : 'text30');
  }}
  ${fx.marginRight(6)}
  &.lp-price {
    margin-right: 6px;
  }
`;

// 最新价格
const LastPriceMD = () => `
  &.header {
    flex: initial;
    ${fx.display('flex')}
    ${fx.alignItems('center')}
    ${fx.flexWrap('wrap')}
    > span {
      display: block;
    }
  }
`;

export const LastPrice = HOC(styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.flexWrap('wrap')}
  ${fx.flex(1)}
  ${(props) => fx.color(props, props.hasValue ? 'text' : 'text30')}
  ${fx.fontSize(16)}
  ${fx.fontWeight(500)}
  ${fx.cursor()}
  &.header {
    display: none;
  }
  ${({ $media }) => $media('md', LastPriceMD())}
`);

const PriceWrapperMd = () => `
  &.header {
    display: flex;
  }
  &.padl26, &.padl8 {
    display: flex;
  }
`;

export const PriceWrapper = HOC(styled.div`
  ${fx.height(16)}
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.fontSize(12)}
  ${(props) => fx.color(props, 'text')}
  & svg {
    ${fx.paddingRight(4)}
    box-sizing: content-box;
  }
  &.header {
    display: none;
  }
  &.padl26 {
    display: none;
    ${fx.paddingLeft(26)}
  }
  &.padl8 {
    display: none;
    ${fx.paddingLeft(8)}
  }
  ${({ $media }) => $media('md', PriceWrapperMd())}
`);

export const ADLWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.marginLeft(12)}
`;

export const ADLDefault = styled.div`
  width: 2px;
  height: 8px;
  margin-left: 2px;
  background-color: rgba(115, 126, 141, 0.4);
`;

export const Primary = styled(ADLDefault)`
  ${(props) => fx.backgroundColor(props, 'primary')}
`;

export const Complementary = styled(ADLDefault)`
  ${(props) => fx.backgroundColor(props, 'complementary')}
`;

export const Secondary = styled(ADLDefault)`
  ${(props) => fx.backgroundColor(props, 'secondary')}
`;

export const TooltipWrapper = styled.div`
  max-width: 216px;
`;

export const SvgWrapper = styled.div`
  display: block;
  ${(props) => fx.color(props, 'icon')}
  & > svg {
    display: block;
    cursor: help;
  }
`;
