/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-12 21:32:51
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-06-26 18:31:37
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/components/common/Header.js
 * @Description:
 */
import React, { useContext } from 'react';
import { _t } from 'utils/lang';
import { widthCfg } from '../../style';
import SvgComponent from '@/components/SvgComponent';
import { useTheme } from '@kux/mui';
import { FlexColumm, textOveflow } from '@/style/base';
import { styled, fx } from '@/style/emotion';
import { WrapperContext } from '@/pages/Markets/config';

const THWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  ${(props) => {
    if (props.index !== 0) {
      return 'justify-content: flex-end;';
    }
  }}
`;
const SvgColumm = styled(FlexColumm)`
  height: 12px;
  justify-content: space-between;
  margin-left: 2px;
`;

const DividerSpan = styled.span`
  margin:0 4px;
`;

const RowItem = styled.div`
  ${fx.position('relative')}
  ${fx.display('flex')}
  ${fx.height(24)}
  ${fx.lineHeight(24)}
  ${fx.alignItems('center')}
  ${fx.fontSize(12)}
  ${(props) => fx.color(props, 'text60')}
  ${fx.cursor()}
  ${(props) => {
    return props.showHover && fx.backgroundColor(props, 'cover8');
  }}
`;

const HeaderRow = styled(RowItem)`
  ${fx.flex(1)}
  ${(props) => fx.color(props, 'text30')}
  ${fx.fontWeight(400)}
  &:hover {
    background-color: initial;
  }
  & > div {
    white-space: nowrap;
  }
  & > div:nth-of-type(1) {
    ${fx.marginLeft(12)}
  }
  & > div:nth-of-type(2) {
    ${fx.textAlign('right')}
    ${fx.margin('0 8px')}
  }
  & > div:nth-of-type(3) {
    ${fx.textAlign('right')}
    ${fx.marginRight(8)}
  }
`;

// 受控 通用
export const TH = ({
  labelClassName,
  children,
  style,
  handleSort,
  sortkey,
  index,
  sortDirection,
}) => {
  const { colors } = useTheme();
  return (
    <THWrapper onClick={() => handleSort(sortkey)} style={style} index={index}>
      <span className={labelClassName}>{children}</span>
      <SvgColumm>
        <SvgComponent
          type="sort-arrow-up"
          fileName="markets"
          width={7}
          height={6}
          color={sortDirection === 'ascend' ? colors.primary : 'currentColor'}
        />
        <SvgComponent
          type="sort-arrow-down"
          fileName="markets"
          width={7}
          height={6}
          color={sortDirection === 'descend' ? colors.primary : 'currentColor'}
        />
      </SvgColumm>
    </THWrapper>
  );
};

const Header = (props) => {
  const screen = useContext(WrapperContext);

  const { handleSort, sortKey, sortDirection } = props;

  return (
    <HeaderRow key="header">
      <div key={'list-header-symbol-pair'} style={{ width: screen === '400' ? '30%' : widthCfg[0] }}>
        <TH
          handleSort={handleSort}
          sortkey={'symbolCode'}
          index={0}
          sortDirection={sortKey === 'symbolCode' ? sortDirection : ''}
        >
          {`${_t('orders.col.symbol')}`}
        </TH>
      </div>
      {screen === '400' ?
        <React.Fragment>
          <div key={'list-header-symbol-lastprice'} style={{ width: '70%' }}>
            <TH
              handleSort={handleSort}
              sortkey={'lastTradedPrice'}
              index={1}
              sortDirection={sortKey === 'lastTradedPrice' ? sortDirection : ''}
              style={{ display: 'inline-flex' }}
            >
              {`${_t('ndESvCJPTxLC7VeCQ7LScN')}`}
            </TH>
            <DividerSpan>/</DividerSpan>
            <TH
              handleSort={handleSort}
              sortkey={'changeRate'}
              index={2}
              sortDirection={sortKey === 'changeRate' ? sortDirection : ''}
              style={{ display: 'inline-flex' }}
            >
              {`${_t('ikqJ6WH1TMFZbJYmiCBK9T')}`}
            </TH>
          </div>
        </React.Fragment>
    :
        <React.Fragment>
          <div key={'list-header-symbol-lastprice'} style={{ width: widthCfg[1] }}>
            <TH
              handleSort={handleSort}
              sortkey={'lastTradedPrice'}
              index={1}
              sortDirection={sortKey === 'lastTradedPrice' ? sortDirection : ''}
            >
              {`${_t('ndESvCJPTxLC7VeCQ7LScN')}`}
            </TH>
          </div>
          <div key={'list-header-symbol-change'} style={{ width: widthCfg[2] }}>
            <TH
              handleSort={handleSort}
              sortkey={'changeRate'}
              index={2}
              sortDirection={sortKey === 'changeRate' ? sortDirection : ''}
            >
              {`${_t('ikqJ6WH1TMFZbJYmiCBK9T')}`}
            </TH>
          </div>
        </React.Fragment>
      }
    </HeaderRow>
  );
};

export default React.memo(Header);
