/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Flex, Text } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'dva';
import { ICCustomerOutlined } from '@kux/icons';
import { formatNumber } from 'Bot/helper';
import { smartType, colors } from 'SmartTrade/config';
import { fade } from '@kux/mui/utils';
import { ChangeRate } from 'Bot/components/ColorText';
import Button from '@mui/Button';
import { SvgIcon } from 'Bot/components/Common/Icon';
import TinyPieChart from 'SmartTrade/components/Charts/TinyPieChart';

const InverstItemBox = styled.div`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  margin-bottom: 12px;
  padding: 12px;
`;

const Tag = styled.span`
  border-radius: 4px;
  padding: 1px 4px;
  font-size: 12px;
  margin-right: 4px;
  background-color: ${({ theme, color }) => (color ? fade(color, 0.12) : theme.colors.cover4)};
  color: ${({ theme, color }) => color ?? theme.colors.text60};
`;
const isShowTypeTag = (type) => {
  return ![undefined, '', null, -1].includes(type);
};

const GridBox = styled.div`
  margin-bottom: 12px;
  display: flex;
  .pose-rate {
    font-size: 14px;
    font-weight: 700;
  }
  .flex1 {
    flex: 1;
  }
  .hr-line {
    border-top: 0.5px solid ${({ theme }) => theme.colors.divider8};
  }
  > div {
    flex: 1 1 33.33%;
    &:nth-of-type(2) {
      text-align: center;
    }
    &:last-of-type {
      text-align: right;
    }
  }
`;

const CoinTag = styled.span`
  position: relative;
  margin-right: 14px;
  display: inline-block;
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    bottom: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin: auto;
    background-color: ${({ index }) => colors[index]};
  }
`;

const BtnGroup = styled(Flex)`
  > button {
    flex: 1;
  }
`;
const CurrencyNames = ({ positionTargets }) => {
  const coinDict = useSelector((state) => state.categories);
  return positionTargets?.map((coin, index) => (
    <CoinTag className="coin-tag" key={coin.currency} index={index}>
      {coinDict[coin.currency]?.currencyName || coin.currency}
    </CoinTag>
  ));
};
const InverstItem = ({ item, detailRef, onCreate }) => {
  const targetTag = smartType.find((el) => el.value === item.type);
  let typeText = targetTag?.text;
  const typeColor = targetTag?.color;
  typeText = typeText ? _t(typeText) : ''; // 特殊tag ,来自type,需要加特殊样式，需要从templateTag中去除
  const tags = item.templateTag.split(',').filter((el) => el && el !== typeText);

  const openDetail = (data) => {
    detailRef.current.itemData = data;
    detailRef.current.updateBtnProps({
      title: data.name,
    });
    detailRef.current.show();
  };
  return (
    <InverstItemBox className="smarttrade-portfolio" id={item.id}>
      <Flex mb={8} vc sb>
        <Text fs={14} color="text" fw={500} lh="130%" style={{ maxWidth: '80%' }}>
          {item.name}
        </Text>
        <Flex vc color="text40" fs={12}>
          <SvgIcon color="none" type="user" fileName="botsvg" width="12" height="12" keepOrigin />
          <Text ml={4}>{formatNumber(item.totalRunNumber)}</Text>
        </Flex>
      </Flex>

      <Flex mb={12}>
        {isShowTypeTag(item.type) && (
          <Tag key="tg-0" color={typeColor}>
            {typeText}
          </Tag>
        )}
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Flex>

      <GridBox>
        <div>
          <ChangeRate value={item.dailyChangeRate} className="pose-rate" />
          <Flex vc fs={12} color="text40" lh="130%" mt={2}>
            {_t('smart.24hours')}
            <span className="ml-4 hr-line flex1" />
          </Flex>
        </div>
        <div>
          <ChangeRate value={item.weeklyChangeRate} className="pose-rate" />
          <Flex vc fs={12} color="text40" lh="130%" mt={2}>
            <span className="hr-line flex1 mr-4" />
            {_t('smart.recent7days')}
            <span className="hr-line flex1 ml-4 " />
          </Flex>
        </div>
        <div>
          <ChangeRate value={item.monthlyChangeRate} className="pose-rate" />
          <Flex vc fs={12} color="text40" lh="130%" mt={2}>
            <span className="hr-line flex1 mr-4" />
            {_t('smart.recent30days')}
          </Flex>
        </div>
      </GridBox>

      <Flex vc mb={12}>
        <div className="mr-18">
          <TinyPieChart id={item.id} data={item.positionTargets} />
        </div>
        <Text fs={12} color="text" className="coin-tag-wrap">
          <CurrencyNames positionTargets={item.positionTargets} />
        </Text>
      </Flex>
      <BtnGroup>
        <Button
          size="mini"
          type="default"
          className="btn-intro"
          onClick={() => openDetail(item)}
          mr={8}
        >
          {_t('smart.simpleintro')}
        </Button>
        <Button
          size="mini"
          type="primary"
          className="btn-nowcreate"
          onClick={() => onCreate(item)}
        >
          {_t('smart.nowcreate')}
        </Button>
      </BtnGroup>
    </InverstItemBox>
  );
};

export default InverstItem;
