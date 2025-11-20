/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef.js';
import { Flex, Text } from 'Bot/components/Widgets';
import { ChangeRate } from 'Bot/components/ColorText';
import { formatNumber } from 'Bot/helper';
import styled from '@emotion/styled';
import { _t, _tHTML } from 'Bot/utils/lang';
import CoinIcon from '@/components/CoinIcon';
import { getHoldCoins } from 'SmartTrade/services';
import Spin from '@mui/Spin';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 12px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.cover2};
  > span {
    line-height: 20px;
    height: 20px;
    &:nth-of-type(2) {
      text-align: left;
    }
    &:last-of-type {
      text-align: right;
    }
  }
`;
const MCoinIcon = styled(CoinIcon)`
  width: 20px;
  height: 20px;
`;
const CoinDescItem = ({ item }) => {
  return (
    <Grid>
      <span>
        <MCoinIcon currency={item.code} />
      </span>
      <Text color="text">{item.usdtPrice ? formatNumber(item.usdtPrice) : '--'}</Text>
      <ChangeRate value={item.percentChange24h} />
    </Grid>
  );
};

const MinHeight = styled.div`
  min-height: 100px;
`;
const Detail = ({ detailRef, onCreate }) => {
  const item = detailRef.current.itemData;
  const currencyTexts = item.positionTargets.map((el) => el.currency).join(',');
  const [lists, setLists] = useState([]);
  const FetchInvestComposeDetail = useCallback(
    (_) => {
      getHoldCoins(currencyTexts).then(({ data }) => {
        setLists(data);
      });
    },
    [currencyTexts],
  );
  useEffect(() => {
    FetchInvestComposeDetail();
  }, []);
  const onconfirm = React.useCallback(() => {
    detailRef.current.close();
    onCreate(detailRef.current.itemData);
  }, [onCreate]);
  useBindDialogButton(detailRef, onconfirm);
  return (
    <>
      <Text as="div" fs={14} color="text60" fw={500} lh="130%" mb={16}>
        {item.description}
      </Text>
      <Spin spinning={!lists.length} size="xsmall">
        <MinHeight>
          {lists.map((list) => (
            <CoinDescItem key={list.code} item={list} />
          ))}
        </MinHeight>
      </Spin>
    </>
  );
};
const DetailWrap = ({ detailRef, onCreate }) => {
  return (
    <DialogRef
      ref={detailRef}
      title={detailRef.current?.itemData?.name}
      cancelText={_t('cancel')}
      okText={_t('smart.runtrade')}
      onOk={() => detailRef.current.confirm()}
      onCancel={() => detailRef.current.close()}
      size="medium"
    >
      <Detail detailRef={detailRef} onCreate={onCreate} />
    </DialogRef>
  );
};

export default DetailWrap;
