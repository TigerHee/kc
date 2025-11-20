/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect, useRef } from 'react';
import { styled } from '@kux/mui/emotion';
import { useDispatch, useSelector } from 'dva';
import AccuProfit from './AccuProfit';
import DailyProfit from './DailyProfit';
import RevenueLayout from './RevenueLayout';
import AssetsLayout from './AssetsLayout';
import WinRate from './WinRate';
import { Profit, FormatNumber } from 'Bot/components/ColorText';
import { ICInfoOutlined } from '@kux/icons';
import DialogRef from 'Bot/components/Common/DialogRef';
import isEqual from 'lodash/isEqual';
import AssetsDetailDialogRef from './AssetsDetailDialogRef';
import isEmpty from 'lodash/isEmpty';
import { _t } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import AutoSizer from 'react-virtualized-auto-sizer';
import { WrapperContext } from '../../config';
// 投资、收益显示的精度
export const profitPrecision = {
  USDT: 3,
  ETH: 6,
  BTC: 8,
};

const BaseBox = styled.div`
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.cover2};
  padding: 12px;
`;
const ChartBox = styled(BaseBox)`
  flex-shrink: 0;
`;

const lg = ['lg1', 'lg2', 'lg3'];
const sm = ['sm', 'md', 'lg'];

const ProfitBox = styled(BaseBox)`
  margin-bottom: 12px;
  flex-shrink: 0;
  .right-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  ${({ screen }) => {
    if (lg.includes(screen)) {
      return `
      display: flex;
      align-items: center;
      .history-data {
        margin: 0 40px;
      }
      
   `;
    } else if (sm.includes(screen)) {
      return `.right-data {
                >div {
                  margin-top: 10px;
                  &:last-of-type {
                    text-align: right;
                  }
                }
              }`;
    }
  }}
`;

const Box = styled.div`
  padding: 0 12px 12px;
  [dir='rtl'] & {
    canvas {
      /* @noflip */
      direction: ltr;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  > span:last-of-type {
    text-align: right;
  }
`;

const Resize = styled.div`
  ${({ screen }) => {
    if (lg.includes(screen)) {
      return `
      display: grid;
      grid-column-gap: 12px;
      grid-row-gap: 12px;
      grid-template-columns: repeat(2, 1fr);'
      .history-data {
        margin: 0 40px;
      }
      `;
    } else if (sm.includes(screen)) {
      return `>div {
        margin-bottom: 12px;
      }`;
    }
  }}
`;

export const Container = React.memo((props) => {
  const screen = React.useContext(WrapperContext);
  const height = ['sm', 'md', 'lg'].includes(screen) ? 244 : 264;
  return (
    <AutoSizer disableHeight>
      {({ width }) => {
        return <div style={{ width, height }}>{props.children}</div>;
      }}
    </AutoSizer>
  );
});

export const Container2 = React.memo((props) => {
  return (
    <AutoSizer disableHeight>
      {({ width }) => {
        return (
          <div style={{ width, height: 170, marginTop: 16 }}>
            {props.children}
          </div>
        );
      }}
    </AutoSizer>
  );
});

const isEmptyVal = (num) => {
  return [0, '', null, undefined, '0'].includes(num);
};

/**
 * @description: 展示解释
 * @return {*}
 */
const showNotice = () => {
  return DialogRef.info({
    title: _t('goodhint'),
    content: _t('profitpagehint'),
    cancelText: null,
    okText: _t('gridform24'),
    maskClosable: true,
    size: 'basic',
  });
};
export default function ({ screen, className }) {
  const dispatch = useDispatch();
  const dialogDetailRef = useRef();
  const {
    total,
    day,
    quotaCurrency,
    assetLayout = {},
    accuProfit = {},
  } = useSelector((state) => state.BotProfit, isEqual);

  const { overallRecordVO = {}, profitDistributions = [] } = total;
  const { currentDay, data } = accuProfit;
  const {
    totalProfit,
    totalRunningAmount,
    todayRunningProfit,
    historyProfit,
  } = day;
  const precision = profitPrecision[quotaCurrency];

  const { balanceCount, profitCount, deficitCount } = overallRecordVO || {};
  const isEmptyNow =
    isEmptyVal(balanceCount) &&
    isEmptyVal(profitCount) &&
    isEmptyVal(deficitCount);

  useEffect(() => {
    dispatch({
      type: 'BotProfit/getDayProfit',
    });
    dispatch({
      type: 'BotProfit/getTotalProfit',
    });
    dispatch({
      type: 'BotProfit/getAssetLayout',
    });
    dispatch({
      type: 'BotProfit/getAccuProfit',
    });
  }, []);

  return (
    <Box className={className}>
      <ProfitBox screen={screen}>
        <div>
          <Flex color="text40" fs={13} mb={6} vc>
            <Text mr={4}>{`${_t('totalprofit2')} USDT`}</Text>
            <ICInfoOutlined className="cursor-pointer" onClick={showNotice} />
          </Flex>
          <Text color="text" fs={18} as="div" mb={2} fw={500}>
            <FormatNumber value={totalRunningAmount} precision={precision} />
          </Text>

          <Flex vc fs={12}>
            <Text color="text40" pr={6}>
              {_t('totalprofit3')}:
            </Text>
            <Profit value={todayRunningProfit} precision={precision} />
          </Flex>
        </div>

        <div className="right-data">
          <div className="history-data">
            <Text color="text40" fs={13} as="div" mb={6}>
              {_t('profittab2')}
            </Text>
            <Profit value={historyProfit} precision={precision} fw={500} />
          </div>

          <div>
            <Text color="text40" fs={13} as="div" mb={6}>
              {_t('totalprofit1')}
            </Text>
            <Profit value={totalProfit} precision={precision} fw={500} />
          </div>
        </div>
      </ProfitBox>

      <Resize screen={screen}>
        {/* 累计收益 */}
        <ChartBox>
          <Header>
            <Text color="text" fs={14} fw={500}>
              {_t('accuprofit')}
            </Text>
            <Text color="text40" fs={12}>
              {_t('totalprofit4')}
            </Text>
          </Header>
          <AccuProfit currentDay={currentDay} data={data} />
        </ChartBox>
        {/* 每日收益 */}
        <ChartBox>
          <Header>
            <Text color="text" fs={14} fw={500}>
              {_t('totalprofit5')}
            </Text>
            <Text color="text40" fs={12}>
              {_t('totalprofit8')}
            </Text>
          </Header>
          <DailyProfit
            day={day}
            precision={precision}
            quotaCurrency={quotaCurrency}
          />
        </ChartBox>
        {/* 收益分布 */}
        {!isEmpty(profitDistributions) && (
          <ChartBox>
            <Header>
              <Text color="text" fs={14} fw={500}>
                {_t('totalprofit6')}
              </Text>
              <Text color="text40" fs={12}>
                {_t('totalprofit4')}
              </Text>
            </Header>
            <RevenueLayout profitDistributions={profitDistributions} />
          </ChartBox>
        )}
        {/* 资产分布 */}
        {!isEmpty(assetLayout?.items) && (
          <ChartBox>
            <Header>
              <Text color="text" fs={14} fw={500}>
                {_t('assetslayout')}
              </Text>
              <Text
                onClick={() => dialogDetailRef.current.toggle()}
                cursor="pointer"
                color="primary"
                fs={12}
              >
                {_t('chartdetail')}
              </Text>
              <AssetsDetailDialogRef dialogDetailRef={dialogDetailRef} />
            </Header>
            <AssetsLayout assetLayout={assetLayout} />
          </ChartBox>
        )}
        {/* 胜率统计 */}
        {!isEmptyNow && (
          <ChartBox>
            <Header>
              <Text color="text" fs={14} fw={500}>
                {_t('totalprofit7')}
              </Text>
              <Text color="text40" fs={12}>
                {_t('totalprofit4')}
              </Text>
            </Header>
            <WinRate data={overallRecordVO} />
          </ChartBox>
        )}
      </Resize>
    </Box>
  );
}
