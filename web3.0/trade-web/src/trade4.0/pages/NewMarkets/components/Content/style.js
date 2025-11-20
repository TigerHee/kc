/*
 * @Owner: Clyne@kupotech.com
 */
import { FlexColumm, textOveflow } from '@/style/base';
import { styled, fx, withMedia } from '@/style/emotion';
import { name } from '../../config';

export const widthCfg = ['50%', '25%', '25%'];
export const widthMSCfg = ['60%', '40%'];

const HOC = (FC) => withMedia(name, FC);

export const THWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;
export const SvgColumn = styled(FlexColumm)`
  height: 12px;
  justify-content: space-between;
  margin-left: 2px;
`;

const sortMsStyle = () => `
  .pairSort,
  .coinSort {
    width: ${widthMSCfg[1]};
  }
  .right-box {
    width: ${widthMSCfg[0]};
    display: flex;
    justify-content: flex-end;
    text-align: right;
    ${fx.alignItems('center')}
    .line {
      padding: 0 4px;
    }
    .market-sort {
      white-space: nowrap;
      width: auto;
    }
  }
`;

const sortMdStyle = () => `
  .pairSort, .coinSort {
    width: ${widthCfg[0]}
  }
  .lastPriceSort {
    justify-content: flex-end;
    text-align: right;
    width: ${widthCfg[1]}
  }
  .changeSort {
    justify-content: flex-end;
    text-align: right;
    width: ${widthCfg[2]}
  }
.
`;

export const ContentWrapper = HOC(styled(FlexColumm)`
  flex: 1;
  ${fx.overflow('hidden')}
  .market-header {
    display: flex;
    height: auto;
    ${fx.alignItems('center')}
    ${(props) => fx.color(props, 'text30')}
    ${fx.fontSize(12)}
    padding: 6px 12px;
    .market-sort {
      display: flex;
      ${fx.alignItems('center')}
    }
    ${({ $media }) => $media('sm', sortMsStyle())}
    ${sortMdStyle()}
  }
  .market-list {
    overflow: hidden;
    flex: 1;
  }
  .loading {
    display: flex;
    ${fx.alignItems('center')}
    ${fx.justifyContent('center')}
    .loading-spin {
      align-self: center;
    }
  }
  .market-group {
    padding-top: 10px;
    .group-header {
      padding: 0 12px 4px 12px;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      ${(props) => fx.color(props, 'text40')}
      justify-content: space-between;
      svg {
        display: block;
      }
    }
    .group-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      ${(props) => fx.color(props, 'primary')}
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      svg {
        ${fx.cursor()}
        display: block;
      }
      div {
        ${fx.cursor()}
      }
    }
  }
  .market-item {
    display: flex;
    flex: 1;
    height: 44px;
    align-items: center;
    justify-content: space-between;
    ${fx.cursor()}
    line-height: 17px;
    display: flex;
    padding: 5px 12px;
    padding-left: 8px;
    ${(props) => fx.color(props, 'text30')}
    &:hover {
      ${(props) => fx.backgroundColor(props, 'cover4')}
    }
    &.active {
      ${(props) => fx.backgroundColor(props, 'cover4')}
    }
    .symbol-change {
      text-align: right;
      font-size: 12px;
    }
    .symbol-lastprice {
      ${(props) => fx.color(props, 'text')}
      font-size:12px;
      text-align: right;
    }
    .symbol-pair {
      display: flex;
      overflow: hidden;
      ${fx.alignItems('center')}
      flex-wrap: nowrap;
      font-weight: 500;
      font-size: 12px;
      .symbol-box {
      }
      .can-wrap {
        flex-wrap: wrap;
      }
      .base {
        ${(props) => fx.color(props, 'text')}
      }
      .icon {
        margin-right: 6px;
      }
      .coin {
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        ${(props) => fx.color(props, 'text')}
        .name {
          font-weight: 400;
          ${(props) => fx.color(props, 'text40')}
        }
      }
    }
    .symbolCodeToName {
      ${(props) => fx.color(props, 'text')}
    }
    .market-item-r {
      display: flex;
      ${fx.flexFlow('column')}
      justify-content: flex-end;
    }
  }
`);

export const SvgComponentWrapper = styled.div`
  display: flex;
  width: 12px;
  height: 12px;
  margin-right: 5px;
`;

export const NoWrapper = styled.div`
  flex-shrink: 0;
`;

export const Flags = styled.div`
  display: flex;
`;
