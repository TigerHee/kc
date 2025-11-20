/*
 * owner: Clyne@kupotech.com
 */
import { styled, fx, withMedia } from '@/style/emotion';
import { ORDER_BOOK_BUY, colorMap, name } from '@/pages/Orderbook/config';
import { FlexColumm, textOveflow } from '@/style/base';

export const widthCfg = ['30%', '35%', '35%'];
const HOC = (FC) => withMedia(name, FC);

export const ListWrapper = styled(FlexColumm)`
  ${fx.position('relative')}
  ${fx.flex(1)}
  ${fx.overflow('hidden')}
  &.loading {
    justify-content: center;
  }
`;

export const ListContent = styled.div`
  ${fx.flex(1)}
  ${fx.overflow('hidden')}
`;

export const RowItem = styled.div`
  ${fx.position('relative')}
  ${fx.display('flex')}
  ${fx.height(24)}
  ${fx.lineHeight(24)}
  ${fx.alignItems('center')}
  ${fx.fontSize(12)}
  ${(props) => fx.color(props, 'text60')}
  ${fx.cursor()}
  ${(props) => {
    return props.showHover && fx.backgroundColor(props, 'cover4');
  }}
  ${(props) => {
    const { isActive } = props;
    if (isActive) {
      return `
      &::before {
        content: ' ';
        position: absolute;
        top: 50%;
        left: 4px;
        width: 4px;
        height: 4px;
        margin-top: -2px;
        ${fx.borderRadius('50%')}
        ${fx.backgroundColor(props, 'complementary')}
      }
    `;
    }
    return '';
  }}
`;

const ItemCommon = styled.div`
  ${fx.position('relative')}

  z-index: 2;
`;

export const Price = styled(ItemCommon)`
  ${fx.width(widthCfg[0], '')}
  ${fx.paddingLeft(12)}
  ${(props) => {
    return fx.color(props, colorMap[props.type]);
  }}
`;

export const Amount = styled(ItemCommon)`
  ${fx.width(widthCfg[1], '')}
  ${fx.textAlign('right')}
  ${fx.margin('0 4px')}
  ${(props) => fx.color(props, 'text')}
`;

export const Total = styled(ItemCommon)`
  ${fx.width(widthCfg[2], '')}
  ${fx.textAlign('right')}
  ${fx.marginRight(12)}
  ${(props) => fx.color(props, 'text')}
`;

const PctMd = (type) => {
  if (type === ORDER_BOOK_BUY) {
    return `
      transform-origin: left;
    `;
  }
};

export const Pct = HOC(styled.div`
  transform-origin: right;
  ${fx.position('absolute')}
  left: 0;
  right: 0;
  z-index: 1;
  ${(props) => {
    return fx.backgroundColor(props, colorMap[`${props.type}12`]);
  }}
  ${({ isAnimateEnabled }) => {
    return isAnimateEnabled ? `
      top: 1px;
      bottom: 1px;
      will-change: transform;
      transition-property: transform;
      transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
    ` : `
      top: 0px;
      bottom: 0px;
      transition: none;
    `;
  }}
  ${({ $media, type }) => $media('md', PctMd(type))}
`);

export const HeaderRow = styled(RowItem)`
  ${(props) => fx.color(props, 'text40')}
  ${fx.fontWeight(400)}
  ${fx.marginBottom(4)}
  &:hover {
    background-color: initial;
  }
  & > div {
    ${fx.overflow('hidden')}
    ${textOveflow}
  }
  & > div:nth-of-type(1) {
    ${fx.paddingLeft(12)}
  }
  & > div:nth-of-type(2) {
    ${fx.margin('0')}
    ${fx.textAlign('right')}
  }
  & > div:nth-of-type(3) {
    ${fx.textAlign('right')}
    ${fx.marginRight(12)}
  }
`;
const arrowW = 10;
// tips
const text = 'color: rgba(243, 243, 243, 0.6);';
const value = 'color: #F3F3F3;';
const bg = 'background: #2D2D2F;';
export const TipWrapper = styled.div`
  display: none;
  ${(props) => props.theme.breakpoints.up('lg')} {
    display: ${({ show }) => (show ? 'block' : 'none')};
  }

  ${fx.position('absolute')}
  z-index: 1000;
  font-size: 14px;
  ${(props) => fx.color(props, 'text60')}
  ${text}
  ${bg}
  ${fx.transform('translateX(calc(-100% - 10px))')}
  border-radius: 4px;
  ${fx.padding('5px 10px')}
  &:before {
    content: ' ';
    pointer-events: none;
    ${fx.position('absolute')}
    ${(props) => {
      const { arrow: direction } = props;
      return `
        ${direction}: -15px;
        top: 50%;
        transform: translateY(-50%);
        border: ${arrowW}px solid transparent;
        border-${
          direction === 'right' ? 'left' : 'right'
        }: ${arrowW}px solid #2D2D2F;
        `;
    }}
  }
`;
export const TipFlex = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.marginTop(8)}
  &:first-of-type {
    ${fx.marginTop(0)}
  }
`;
export const TipName = styled.div`
  font-weight: 400;
`;
export const TipValue = styled.div`
  font-weight: 500;
  ${(props) => fx.color(props, 'text')}
  ${value}
  ${fx.textAlign('right')}
  flex: 1;
  margin-left: 12px;
`;
