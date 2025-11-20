/**
 * Owner: mike@kupotech.com
 */
import { useSelector } from 'dva';
import DialogRef from 'Bot/components/Common/DialogRef';
import React from 'react';
import { getCurrencyName } from 'Bot/hooks/useSpotSymbolInfo';
import { times100, formatNumber } from 'Bot/helper';
import { styled } from '@kux/mui/emotion';
import { _t } from 'Bot/utils/lang';
import { getAccountType } from 'Bot/utils/util';
import CoinIcon from '@/components/CoinIcon';
import { Text, Flex } from 'Bot/components/Widgets';

const Item = styled.div`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text60};
`;

const AssetsDetail = () => {
  const { items } = useSelector((state) => state.BotProfit.assetLayout);
  return (
    <div>
      {items?.map((coin) => {
        return (
          <Item key={coin.currency}>
            <Flex fs={14} vc color="text" mb={6}>
              <CoinIcon currency={coin.currency} showName={false} />
                <Text pl={4} pr={4}>
                  {getCurrencyName(coin.currency)}
                </Text>
                  <Text>{getAccountType(coin)}</Text>
            </Flex>

              <Flex fs={12} vc sb>
                <div style={{ width: '33.33%' }} className="left">
                  <span>{_t('zhanbi')}</span>
                    <div className="fs-14">
                      {Number(coin.percent) < 0.01 ? '<1' : times100(coin.percent)}%
                </div>
                </div>
                  <div style={{ width: '33.33%' }} className="center">
                    <span>{_t('shuliang')}</span>
                      <div className="fs-14 ellipsisx">{coin.size ? formatNumber(coin.size) : '--'}</div>
                  </div>
                    <div style={{ width: '33.33%' }} className="right">
                      <span>{_t('jine')}</span>
                        <div className="fs-14 ellipsisx">
                          {formatNumber(coin.value, 3)} USDT
                </div>
                    </div>
              </Flex>
          </Item>
        );
      })}
    </div>
  );
};
export default function ({ dialogDetailRef }) {
  return (
    <DialogRef
      maskClosable
      cancelText={null}
      okText={_t('gridwidget6')}
      onOk={() => dialogDetailRef.current.toggle()}
      onCancel={() => dialogDetailRef.current.toggle()}
      ref={dialogDetailRef}
      title={_t('assetslayoutdetail')}
      size="medium"
    >
      <AssetsDetail />
    </DialogRef>
  );
}
