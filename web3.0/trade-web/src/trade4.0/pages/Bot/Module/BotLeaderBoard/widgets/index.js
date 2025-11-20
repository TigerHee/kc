/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import { _t } from 'Bot/utils/lang';
import styled from '@emotion/styled';
import { getColors } from 'src/helper';
import { ChangeRate } from 'Bot/components/ColorText';
import {
  calcChangeRateAll,
  numberResolve,
  formatNumber,
  getBase,
  formatSpanDuration,
} from 'Bot/helper';
import { getSymbolName, getSymbolNames } from 'Bot/hooks/index';
import { strasMap as strasIdMap, strategiesMap } from 'Bot/config';
import CoinIcon from '@/components/CoinIcon';
import { Flex, Text } from 'Bot/components';
import { ReactComponent as BotIcon } from '@/assets/bot/icons/leaderboard-bots.svg';
import { ReactComponent as CopyIcon } from '@/assets/bot/icons/copy.svg';
import { tabCfg } from '../Strategy';
import Button from '@mui/Button';
import Avatar from 'Bot/components/Common/BotAvatar';

const getBotName = (templateType) => {
  return strasIdMap.get(templateType)?.lang || strasIdMap.get(1).lang;
};

const getSymbolOrCurrencyName = (item) => {
  // 持仓用currencies字段
  let coin = item.symbols;
  if (Number(item.templateType) === Number(strategiesMap.smarttrade)) {
    coin = item.currencies;
  }
  return getSymbolNames(coin);
};

const CopyButton = styled(Button)`
  background: ${getColors('cover8')};
  color: ${getColors('text')};

  &:hover {
    background: ${getColors('cover4')};
  }
`;

const Row = styled.div`
  position: relative;
  border-radius: 16px;
  border: 1px solid ${getColors('cover8')};
  padding: 12px;
  margin-bottom: 12px;

  &:hover {
    background-color: ${getColors('cover2')};
  }

  .rateValue,
  .totalProfit {
    font-weight: 600;
  }
  .copyIcon {
    color: ${getColors('text40')};
  }

  ${({ tab, theme }) => {
    if (tab === 'profitRateYear' || tab === 'profitRate') {
      return {
        '.rateValue': { color: theme.colors.primary },
      };
    }
    if (tab === 'copyNum') {
      return {
        '.copyNum': { color: theme.colors.primary },
      };
    }
    if (tab === 'baseUnitProfit') {
      return {
        '.totalProfit': { color: theme.colors.primary },
      };
    }
  }}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2px;

  > div {
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    color: ${getColors('text30')};
  }

  &:hover {
    background-color: ${({ hoverEffect, theme }) => (hoverEffect ? theme.colors.cover2 : '')};
  }

  .right {
    text-align: right;
  }
`;

const RightLine = styled.span`
  padding-right: 8px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 3px;
    bottom: 3px;
    right: 4px;
    border-right: 1px solid ${getColors('cover4')};
  }
`;

export const TabWrapper = styled.div`
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid ${getColors('divider4')};
  border-top: 1px solid ${getColors('divider4')};
`;

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const GrayTag = styled.span`
  padding: 0 4px;
  border-radius: 4px;
  font-size: 12px;
  background-color: ${({ theme }) => theme.colors.cover4};
  color: ${({ theme }) => theme.colors.text60};
  line-height: 130%;
`;

const cfg = {
  newCurrency: 'listtime',
  volume: '2s2fYAwcn6ae39ujCw5egB',
};

/**
 * @description: 币种维度头部
 * @param {string} tab 新币展示上线以来
 * @return {*}
 */
export const RankRowTypeTwoHead = ({ tab }) => {
  return (
    <Grid className="mt-10 mb-6" gap={2}>
      <div>
        {_t(['increase', 'newCurrency'].includes(tab) ? 'cointype' : 'share5')}
        {cfg[tab] ? `/${_t(cfg[tab])}` : ''}
      </div>
      <div className="right">
        {_t('gridwidget13')}/{_t('gridwidget14')}
      </div>
      <div className="right">
        {_t('24hpr')}/{_t('strategy')}
      </div>
    </Grid>
  );
};

/**
 * @description: 币维度展示
 * @param {*} param1
 * @return {*}
 */
export const RankRowTypeTwo = ({ item, tab, blockId, locationId }) => {
  // const {
  //   current: { onClickRank }
  // } = useContext(copyContext);
  let dataField = null;
  if (tab === 'newCurrency') {
    if (Number(item.openingPrice) > 0) {
      dataField = (
        <ChangeRate
          empty="--"
          value={calcChangeRateAll(item.price, item.openingPrice)}
          className="fs-12"
          color="text40"
        />
      );
    }
  } else if (tab === 'volume') {
    dataField = (
      <Text className="fs-12" color="text40">
        {Number(item.volValue) > 0 ? numberResolve(item.volValue) : '--'}
      </Text>
    );
  } else if (tab === 'botNum') {
    dataField = (
      <Flex vc color="text40">
        <BotIcon />
        <span className="pl-4 fs-12">
          {Number(item.taskCount) > 0 ? formatNumber(item.taskCount, 0) : '--'}
        </span>
      </Flex>
    );
  }
  const handleClickRank = () => {
    // trackClick([blockId, `${locationId + 1}`]);
    // 年华负数不显示详情
    if (Number(item.apr) <= 0) {
      return;
    }
    // TODO:
    // onClickRank(item);
    console.log(item);
  };
  return (
    <Grid hoverEffect={!!item.taskId} onClick={handleClickRank} className="paddingLR pt-8 pb-8">
      <Flex vc>
        <CoinIcon currency={item.currency || getBase(item.symbolCode)} showName={false} />
        <Flex v className="ml-8">
          <Text fs="12" color="text" fw="500">
            {getSymbolName(item.currency || item.symbolCode)}
          </Text>
          {dataField}
        </Flex>
      </Flex>
      <Flex v className="right">
        <Text fs="12" color="text" fw="500">
          {item.price ? formatNumber(item.price) : '--'}
        </Text>
        <ChangeRate isSeparate value={item.changeRate} className="fs-12" color="text40" />
      </Flex>
      <Flex ve fe v className="right">
        <ChangeRate
          value={Number(item.hour24ProfitRate) > 0 ? item.hour24ProfitRate : null}
          className="fs-14 mb-2 lh-16"
          empty="--"
          isSeparate
          Component="div"
        />
        {Number(item.hour24ProfitRate) > 0 ? (
          item.templateType ? (
            <GrayTag>{_t(getBotName(item.templateType))}</GrayTag>
          ) : (
            '--'
          )
        ) : (
          '--'
        )}
      </Flex>
    </Grid>
  );
};

/**
 * @description: 策略维度展示
 * @param {*} param1
 * @return {*}
 */
export const RankRowTypeOne = ({ item, tab, blockId, locationId = 0 }) => {
  // const {
  //   current: { onClickRank }
  // } = useContext(copyContext);
  const tabMeta = tabCfg.find((tb) => tb.value === tab);
  const isNotShowDetail = Number(item.profit) <= 0;
  const handleClickRank = () => {
    // trackClick([blockId, `${locationId + 1}`]);
    if (isNotShowDetail) {
      return;
    }
    // TODO:
    console.log(item);
    // onClickRank(item);
  };
  // item.templateType = 9;
  return (
    <Row onClick={handleClickRank} tab={tab}>
      <Flex vc className="mb-8">
        <Avatar size={20} id={item.templateType} />
        <Text ml={4} as="div" fs={14} fw={500} lh="130%" color="text">
          {getSymbolOrCurrencyName(item)}
        </Text>
      </Flex>

      <Flex vc>
        <GrayTag>{_t(getBotName(item.templateType))}</GrayTag>
        <Text fs={12} color="text40" lh="130%" className="ml-6">
          {_t('runduration')}: {formatSpanDuration(item.runningSeconds * 1000)}
        </Text>
      </Flex>

      <Flex sb className="mt-12 mb-12">
        <Flex v>
          <Text as="div" fs={12} color="text40" lh="130%" mb={2}>
            {_t(tabMeta.field.lang)}
          </Text>
          <ChangeRate
            value={item[tabMeta.field.dataKey]}
            hasUnit={false}
            empty="--"
            className="fs-14 rateValue"
            color="text"
            isSeparate
          />
        </Flex>
        <Flex v ve>
          <Text as="div" fs={12} color="text40" lh="130%" mb={2}>
            {_t('card7')}(USDT)
          </Text>
          <Text className="totalProfit" fs="14" color="text">
            {formatNumber(item.baseUnitProfit, 2)}
          </Text>
        </Flex>
      </Flex>

      <Flex sb>
        <Flex vc>
          <CopyIcon width="12" height="12" className="mr-2 copyIcon" />
          <Text fs="12" lh="130%" color="text40" className="copyNum">
            {formatNumber(item.copyNum, 0)}
          </Text>
        </Flex>
        <div className="Flex vc fe">
          {!isNotShowDetail && <CopyButton size="mini">{_t('followorder')}</CopyButton>}
        </div>
      </Flex>
    </Row>
  );
};
