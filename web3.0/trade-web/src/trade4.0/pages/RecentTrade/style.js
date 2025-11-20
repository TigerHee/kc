/*
 * owner: Clyne@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import { FlexColumm, textOveflow } from '@/style/base';

export const widthCfg = ['40%', '35%', '25%'];
export const Wrapper = styled(FlexColumm)`
  flex: 1;
  font-size: 12px;
  font-weight: 400;
  .loading-trade {
    flex: 1;
  }
  > .header-row {
    ${fx.position('relative')}
    ${fx.display('flex')}
    ${fx.height(32)}
    ${fx.lineHeight(32)}
    ${fx.alignItems('center')}
    ${fx.fontSize(12)}
    ${(props) => fx.color(props, 'text60')}
    ${fx.cursor()}
    ${(props) => fx.color(props, 'text40')}
    ${fx.fontWeight(400)}
    ${fx.padding('0 12px')}
    &:hover {
      background-color: initial;
    }
    & > div {
      ${fx.overflow('hidden')}
      ${textOveflow}
    }
    & > div:nth-of-type(1) {
      ${fx.paddingLeft(0)}
    }
    & > div:nth-of-type(2) {
      ${fx.margin('0')}
      ${fx.textAlign('right')}
    }
    & > div:nth-of-type(3) {
      ${fx.textAlign('right')}
      ${fx.marginRight(0)}
    }
  }

  > .recent-list {
    flex: 1;
    overflow: hidden;
    & .recent-item {
      ${fx.cursor()}
      height: 24px;
      line-height: 24px;
      display: flex;
      padding: 0 12px;
      ${(props) => fx.color(props, 'text')}

      &:hover {
        ${(props) => fx.backgroundColor(props, 'cover4')}
      }
    }
    & .recent-buy {
      ${(props) => fx.color(props, 'primary')}
    }

    & .recent-sell {
      ${(props) => fx.color(props, 'secondary')}
    }
    & .recent-time {
      text-align: right;
    }
    & .recent-amount {
      text-align: right;
      ${(props) => fx.color(props, 'text')}
    }
  }
`;
