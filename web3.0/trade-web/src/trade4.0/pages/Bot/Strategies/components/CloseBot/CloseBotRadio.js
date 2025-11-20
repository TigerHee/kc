/**
 * Owner: mikeu@kupotech.com
 */
import React from 'react';
import { getCurrencyInfo } from 'Bot/hooks/useSpotSymbolInfo';
import SectionRadio from 'Bot/components/Common/SectionRadio';
import CoinIcon from '@/components/CoinIcon';
import { _t } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { styled } from '@kux/mui/emotion';

export default SectionRadio;

const FontSizeBox = styled.div`
  ${(props) => props.theme.breakpoints.down('sm')} {
    .sm-fs-14 {
      font-size: 14px;
    }
    .sm-fs-12 {
      font-size: 12px;
    }
  }
`;
/**
 * @description: 退回单个币种
 * @param {String} coin
 * @return {*}
 */
export const ReturnInCoin = ({ coin }) => {
  const { currencyName } = getCurrencyInfo(coin);
  return (
    <FontSizeBox>
      <Flex mb={8} vc>
        <CoinIcon currency={coin} showName={false} />
        <Text pl={8} className="sm-fs-14" color="text">
          {_t('smart.returnasbestprice', { coin: currencyName })}
        </Text>
      </Flex>
      <Text color="text60" fs={14} className="sm-fs-12">
        {_t('smart.marketpricechangehint')}
      </Text>
    </FontSizeBox>
  );
};
/**
 * @description: 退回多个币种
 * @param {Array} coins
 * @return {*}
 */
export const ReturnInAllCoin = ({ coins }) => {
  return (
    <FontSizeBox>
      <Flex mb={8} vc className="overflowX">
        {coins.length <= 2
          ? coins.map((coin, index) => {
              const { currencyName } = getCurrencyInfo(coin);
              return (
                <Flex vc pr={8} key={currencyName}>
                  <CoinIcon currency={coin} showName={false} />
                  <Text pl={8} className="sm-fs-14" color="text">
                    {currencyName}
                  </Text>
                </Flex>
              );
            })
          : coins.map((coin, index) => (
            <CoinIcon
              className="mr-4"
              currency={coin}
              key={coin}
              showName={false}
            />
            ))}
      </Flex>
      <Text color="text60" fs={14} className="sm-fs-12">
        {_t('smart.returnhowmuch', { num: coins.length })}
      </Text>
    </FontSizeBox>
  );
};
