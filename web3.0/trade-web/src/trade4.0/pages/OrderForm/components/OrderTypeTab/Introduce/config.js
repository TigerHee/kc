/**
 * Owner: jessie@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { _t, _tHTML } from 'utils/lang';

import { ReactComponent as TriangleIcon } from '@/assets/orders/triangle.svg';
import { ReactComponent as CloseIcon } from '@/assets/orders/ic2_close_filled.svg';
import LimitBuy from '@/assets/orders/limit-buy.png';
import LimitBuyH5 from '@/assets/orders/limit-buy-h5.png';
import LimitSell from '@/assets/orders/limit-sell.png';
import LimitSellH5 from '@/assets/orders/limit-sell-h5.png';
import Market from '@/assets/orders/market.png';
import MarketH5 from '@/assets/orders/market-h5.png';
import StopLimit from '@/assets/orders/stop-limit.png';
import StopLimitH5 from '@/assets/orders/stop-limit-h5.png';
import StopMarket from '@/assets/orders/stop-market.png';
import StopMarketH5 from '@/assets/orders/stop-market-h5.png';
import OcoBuy from '@/assets/orders/oco-buy.png';
import OcoBuyH5 from '@/assets/orders/oco-buy-h5.png';
import OcoSell from '@/assets/orders/oco-sell.png';
import OcoSellH5 from '@/assets/orders/oco-sell-h5.png';
import TrailingStopBuy from '@/assets/orders/trailing-stop-buy.png';
import TrailingStopBuyH5 from '@/assets/orders/trailing-stop-buy-h5.png';
import TrailingStopSell from '@/assets/orders/trailing-stop-sell.png';
import TrailingStopSellH5 from '@/assets/orders/trailing-stop-sell-h5.png';
import TwapBuy from '@/assets/orders/twap-buy.png';
import TwapBuyH5 from '@/assets/orders/twap-buy-h5.png';
import TwapSell from '@/assets/orders/twap-sell.png';
import TwapSellH5 from '@/assets/orders/twap-sell-h5.png';
import AdvancedLimitFokBuy from '@/assets/orders/advanced-limit-fok-buy.png';
import AdvancedLimitFokBuyH5 from '@/assets/orders/advanced-limit-fok-buy-h5.png';
import AdvancedLimitFokSell from '@/assets/orders/advanced-limit-fok-sell.png';
import AdvancedLimitFokSellH5 from '@/assets/orders/advanced-limit-fok-sell-h5.png';
import AdvancedLimitIocBuy from '@/assets/orders/advanced-limit-ioc-buy.png';
import AdvancedLimitIocBuyH5 from '@/assets/orders/advanced-limit-ioc-buy-h5.png';
import AdvancedLimitIocSell from '@/assets/orders/advanced-limit-ioc-sell.png';
import AdvancedLimitIocSellH5 from '@/assets/orders/advanced-limit-ioc-sell-h5.png';
import AdvancedLimitPostOnlyBuy from '@/assets/orders/advanced-limit-post-only-buy.png';
import AdvancedLimitPostOnlyBuyH5 from '@/assets/orders/advanced-limit-post-only-buy-h5.png';
import AdvancedLimitPostOnlySell from '@/assets/orders/advanced-limit-post-only-sell.png';
import AdvancedLimitPostOnlySellH5 from '@/assets/orders/advanced-limit-post-only-sell-h5.png';

const TimeWeightedLine = styled.div`
  width: 8px;
  height: 1px;
  background-color: ${(props) => props.theme.colors.complementary};
`;

const TimeWeightedCircleFilled = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 8px;

  &.primary {
    background-color: ${(props) => props.theme.colors.primary};
  }
  &.complementary {
    background-color: ${(props) => props.theme.colors.complementary};
  }
  &.icon {
    background-color: ${(props) => props.theme.colors.icon};
  }
`;

const TimeWeightedCircleOutlined = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 8px;

  &.primary {
    border: 1.5px solid ${(props) => props.theme.colors.primary};
  }
  &.complementary {
    border: 1.5px solid ${(props) => props.theme.colors.complementary};
  }
  &.icon {
    border: 1.5px solid ${(props) => props.theme.colors.icon};
  }
`;

const TimeWeightedSquareOutlined = styled.div`
  width: 8px;
  height: 8px;

  &.primary {
    border: 1px solid ${(props) => props.theme.colors.primary};
  }
  &.complementary {
    border: 1px solid ${(props) => props.theme.colors.complementary};
  }
`;

const TimeWeightedAreaGradient = styled.div`
  width: 8px;
  height: 8px;
  &.primary {
    background: linear-gradient(
      180deg,
      ${(props) => props.theme.colors.primary40} 0%,
      rgba(1, 188, 141, 0) 100%
    );
  }
  &.full-grey {
    background: ${(props) => props.theme.colors.cover12};
  }
`;

const DescriptionTitle = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 8px;
  margin-top: 20px;
  color: ${(props) => props.theme.colors.text};
`;

const DescriptionSubTitle = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 8px;
  margin-top: 20px;
  color: ${(props) => props.theme.colors.text60};
`;

const DescriptionContent = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};

  p {
    margin: 0;
  }
`;

const TimeWeightedGroup = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 10px;
    height: 10px;
    margin-left: 2px;
  }
`;

/**
 * 委托类型
 */
export const ORDER_TYPE_INTROS = (isSm) => [
  // 限价单
  {
    value: 'customPrise',
    label: _t('trd.type.limit.o'),
    content: {
      introduce: _t('pq3YA9e36kM76PPHbcWZUE'), // 类型介绍
      sideIllustration: {
        // 区分买卖
        // 图例 （buy | sell）
        buy: {
          description: <DescriptionContent>{_tHTML('a381a0957dff4000a999')}</DescriptionContent>,
          img: isSm ? LimitBuyH5 : LimitBuy,
        },
        sell: {
          description: <DescriptionContent>{_tHTML('ce297faebc9a4000a47d')}</DescriptionContent>,
          img: isSm ? LimitSellH5 : LimitSell,
        },
      },
      timeWeightedImgItems: [
        // 图例
        {
          itemIcon: <TimeWeightedCircleFilled className="primary" />,
          itemTitle: _t('ed7dfd01356c4000abde'),
        },
        {
          itemIcon: <TimeWeightedCircleFilled className="complementary" />,
          itemTitle: _t('315c48a4d6134000ab75'),
        },
        {
          itemIcon: <TimeWeightedAreaGradient className="primary" />,
          itemTitle: _t('3c3a53a5b6ac4000a734'),
        },
      ],
    },
  },
  // 市价单
  {
    value: 'marketPrise',
    label: _t('trd.type.market.o'),
    content: {
      introduce: _t('5b06dcbe21974000afd2'), // 类型介绍
      illustration: {
        description: (
          <>
            <DescriptionContent>{_t('e7d06b6f718e4000a338')}</DescriptionContent>
            <DescriptionSubTitle>{_t('aab8d86366ea4000aa24')}</DescriptionSubTitle>
            <DescriptionContent>{_t('7275e1c1f1144000a81d')}</DescriptionContent>
          </>
        ),
        img: isSm ? MarketH5 : Market,
      },
      timeWeightedImgItems: [
        // 图例
        {
          itemIcon: <TimeWeightedCircleFilled className="primary" />,
          itemTitle: _t('ed7dfd01356c4000abde'),
        },
      ],
    },
  },
  // 高级限价单
  {
    value: 'advancedLimit',
    label: _t('gSwMLa4CkKnfuxZeVSwZCt'),
    content: {
      type: 'multi',
      introduce: _t('9116539cf0084000ac1a'), // 类型介绍
      subChilds: [
        {
          value: 'postonly',
          itemTitle: _t('9B1Rtyb8j2rCJBdDJQx1MW'),
          itemInfo: _t('tRKyMVY9vELEiTNF825Fp9'),
          sideIllustration: {
            // 区分买卖
            // 图例 （buy | sell）
            buy: {
              description: (
                <DescriptionContent>{_tHTML('3e5b167f60c84000a548')}</DescriptionContent>
              ),
              img: isSm ? AdvancedLimitPostOnlyBuyH5 : AdvancedLimitPostOnlyBuy,
            },
            sell: {
              description: (
                <DescriptionContent>{_tHTML('298ccd1b9a614000af87')}</DescriptionContent>
              ),
              img: isSm ? AdvancedLimitPostOnlySellH5 : AdvancedLimitPostOnlySell,
            },
          },
          timeWeightedImgItems: [
            // 图例
            {
              itemIcon: <TimeWeightedCircleFilled className="primary" />,
              itemTitle: _t('ed7dfd01356c4000abde'),
            },
            {
              itemIcon: (
                <TimeWeightedGroup>
                  <TimeWeightedCircleOutlined className="primary" />
                  <CloseIcon />
                </TimeWeightedGroup>
              ),
              itemTitle: _t('315c48a4d6134000ab75'),
            },
            {
              itemIcon: <TimeWeightedAreaGradient className="primary" />,
              itemTitle: _t('0dbb862c26254000a839'),
            },
          ],
        },
        {
          value: 'fok',
          itemTitle: _t('cy6bX7fNPPnZiqPuUX1nA1'),
          itemInfo: _t('8mxHhSoj5ZE5RnAqKbjgFd'),
          sideIllustration: {
            // 区分买卖
            // 图例 （buy | sell）
            buy: {
              description: (
                <DescriptionContent>{_tHTML('7f8ec797a98c4000adbd')}</DescriptionContent>
              ),
              img: isSm ? AdvancedLimitFokBuyH5 : AdvancedLimitFokBuy,
              timeWeightedImgItems: [
                // 图例
                {
                  itemIcon: <TimeWeightedCircleFilled className="primary" />,
                  itemTitle: _t('ed7dfd01356c4000abde'),
                },
                {
                  itemIcon: <TimeWeightedCircleFilled className="complementary" />,
                  itemTitle: _t('aec163f4a5174000a3b2'),
                },
                {
                  itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
                  itemTitle: _t('ecc30d6f5bd54000a733'),
                },
              ],
            },
            sell: {
              description: (
                <DescriptionContent>{_tHTML('23b8357532e94000a015')}</DescriptionContent>
              ),
              img: isSm ? AdvancedLimitFokSellH5 : AdvancedLimitFokSell,
              timeWeightedImgItems: [
                // 图例
                {
                  itemIcon: <TimeWeightedCircleFilled className="primary" />,
                  itemTitle: _t('ed7dfd01356c4000abde'),
                },
                {
                  itemIcon: <TimeWeightedCircleFilled className="complementary" />,
                  itemTitle: _t('aec163f4a5174000a3b2'),
                },
                {
                  itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
                  itemTitle: _t('eca65772ded44000aa83'),
                },
              ],
            },
          },
        },
        {
          value: 'ioc',
          itemTitle: _t('fS88onf7bS7ibzUgkcaxS4'),
          itemInfo: _t('bxdS61Gp8jT9u6tQWDqzon'),
          sideIllustration: {
            // 区分买卖
            // 图例 （buy | sell）
            buy: {
              description: (
                <DescriptionContent>{_tHTML('70a1a0be63c04000a982')}</DescriptionContent>
              ),
              img: isSm ? AdvancedLimitIocBuyH5 : AdvancedLimitIocBuy,
              timeWeightedImgItems: [
                // 图例
                {
                  itemIcon: <TimeWeightedCircleFilled className="primary" />,
                  itemTitle: _t('ed7dfd01356c4000abde'),
                },
                {
                  itemIcon: <TimeWeightedCircleFilled className="complementary" />,
                  itemTitle: _t('aec163f4a5174000a3b2'),
                },
                {
                  itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
                  itemTitle: _t('ecc30d6f5bd54000a733'),
                },
              ],
            },
            sell: {
              description: (
                <DescriptionContent>{_tHTML('629ed1e5df8b4000a2d5')}</DescriptionContent>
              ),
              img: isSm ? AdvancedLimitIocSellH5 : AdvancedLimitIocSell,
              timeWeightedImgItems: [
                // 图例
                {
                  itemIcon: <TimeWeightedCircleFilled className="primary" />,
                  itemTitle: _t('ed7dfd01356c4000abde'),
                },
                {
                  itemIcon: <TimeWeightedCircleFilled className="complementary" />,
                  itemTitle: _t('aec163f4a5174000a3b2'),
                },
                {
                  itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
                  itemTitle: _t('eca65772ded44000aa83'),
                },
              ],
            },
          },
        },
      ],
    },
  },
  // 限价止损
  {
    value: 'triggerPrise',
    label: _t('trd.type.stop.limit.s'),
    content: {
      introduce: _t('69df5ef48c764000a365'), // 类型介绍
      illustration: {
        description: (
          <>
            <DescriptionContent>{_tHTML('fd46ab1576b14000ad2b')}</DescriptionContent>
            <DescriptionSubTitle>{_t('aab8d86366ea4000aa24')}</DescriptionSubTitle>
            <DescriptionContent>{_t('498afc44b18b4000a251')}</DescriptionContent>
          </>
        ),
        img: isSm ? StopLimitH5 : StopLimit,
      },
      timeWeightedImgItems: [
        // 图例
        {
          itemIcon: <TimeWeightedCircleFilled className="primary" />,
          itemTitle: _t('ed7dfd01356c4000abde'),
        },
        {
          itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
          itemTitle: _t('aaae3666bd174000a855'),
        },
        {
          itemIcon: <TimeWeightedCircleFilled className="complementary" />,
          itemTitle: _t('041b03ef77634000acf6'),
        },
      ],
    },
  },
  // 市价止损
  {
    value: 'marketTriggerPrice',
    label: _t('trd.type.stop.market.s'),
    content: {
      introduce: _t('e22585c7870b4000a8af'), // 类型介绍
      illustration: {
        description: (
          <>
            <DescriptionContent>{_tHTML('8b08fb99eef74000a4f5')}</DescriptionContent>
            <DescriptionSubTitle>{_t('aab8d86366ea4000aa24')}</DescriptionSubTitle>
            <DescriptionContent>{_t('9f4ab8c98db44000a094')}</DescriptionContent>
          </>
        ),
        img: isSm ? StopMarketH5 : StopMarket,
      },
      timeWeightedImgItems: [
        // 图例
        {
          itemIcon: <TimeWeightedCircleFilled className="primary" />,
          itemTitle: _t('ed7dfd01356c4000abde'),
        },
        {
          itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
          itemTitle: _t('aaae3666bd174000a855'),
        },
      ],
    },
  },
  // oco
  {
    value: 'ocoPrise',
    label: _t('trd.type.oco.limit.s'),
    content: {
      introduce: _t('479f02a473934000a055'), // 类型介绍
      sideIllustration: {
        // 区分买卖
        // 图例 （buy | sell）
        buy: {
          description: <DescriptionContent>{_tHTML('fb310d9aad124000a80b')}</DescriptionContent>,
          img: isSm ? OcoBuyH5 : OcoBuy,
          timeWeightedImgItems: [
            // 图例
            {
              itemIcon: <TimeWeightedCircleFilled className="primary" />,
              itemTitle: _t('ed7dfd01356c4000abde'),
            },
            {
              itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
              itemTitle: _t('918f82abb46f4000a93d'),
            },
            {
              itemIcon: <TimeWeightedCircleFilled className="complementary" />,
              itemTitle: _t('ee46188a4fc74000ac48'),
            },
          ],
        },
        sell: {
          description: <DescriptionContent>{_tHTML('9a3b7830f3f74000a264')}</DescriptionContent>,
          img: isSm ? OcoSellH5 : OcoSell,
          timeWeightedImgItems: [
            // 图例
            {
              itemIcon: <TimeWeightedCircleFilled className="primary" />,
              itemTitle: _t('ed7dfd01356c4000abde'),
            },
            {
              itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
              itemTitle: _t('e20ba96d180d4000ac26'),
            },
            {
              itemIcon: <TimeWeightedCircleFilled className="complementary" />,
              itemTitle: _t('e701b310a4fc4000ad75'),
            },
          ],
        },
      },
    },
  },
  // tso 跟踪委托
  {
    value: 'tsoPrise',
    label: _t('trd.form.tso.title'),
    content: {
      introduce: _t('577ae49a4fb74000a8d9'), // 类型介绍
      sideIllustration: {
        // 区分买卖
        // 图例 （buy | sell）
        buy: {
          description: (
            <>
              <DescriptionContent>{_tHTML('9cba21266f1a4000ab2d')}</DescriptionContent>
              <DescriptionSubTitle>{_t('aab8d86366ea4000aa24')}</DescriptionSubTitle>
              <DescriptionContent>{_t('01d35a5846e24000a2fd')}</DescriptionContent>
            </>
          ),
          img: isSm ? TrailingStopBuyH5 : TrailingStopBuy,
          timeWeightedImgItems: [
            // 图例
            {
              itemIcon: <TimeWeightedCircleFilled className="primary" />,
              itemTitle: _t('ed7dfd01356c4000abde'),
            },
            {
              itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
              itemTitle: _t('0585f7f255ba4000a8f2'),
            },
            {
              itemIcon: <TriangleIcon />,
              itemTitle: _t('c3dbabe939ff4000a3e0'),
            },
            {
              itemIcon: <TimeWeightedSquareOutlined className="complementary" />,
              itemTitle: _t('e672e5e97e414000a76f'),
            },
            {
              itemIcon: <TimeWeightedCircleFilled className="complementary" />,
              itemTitle: _t('5cd7f30ccaa34000ae5a'),
            },
          ],
        },
        sell: {
          description: (
            <>
              <DescriptionContent>{_tHTML('678c0de7428e4000a8ba')}</DescriptionContent>
              <DescriptionSubTitle>{_t('aab8d86366ea4000aa24')}</DescriptionSubTitle>
              <DescriptionContent>{_t('17c1660722294000aadf')}</DescriptionContent>
            </>
          ),
          img: isSm ? TrailingStopSellH5 : TrailingStopSell,
          timeWeightedImgItems: [
            // 图例
            {
              itemIcon: <TimeWeightedCircleFilled className="primary" />,
              itemTitle: _t('ed7dfd01356c4000abde'),
            },
            {
              itemIcon: <TimeWeightedCircleOutlined className="complementary" />,
              itemTitle: _t('0585f7f255ba4000a8f2'),
            },
            {
              itemIcon: <TriangleIcon />,
              itemTitle: _t('476f7b4d53224000a14a'),
            },
            {
              itemIcon: <TimeWeightedSquareOutlined className="complementary" />,
              itemTitle: _t('e672e5e97e414000a76f'),
            },
            {
              itemIcon: <TimeWeightedCircleFilled className="complementary" />,
              itemTitle: _t('5cd7f30ccaa34000ae5a'),
            },
          ],
        },
      },
    },
  },
  // 时间加权委托
  {
    value: 'timeWeightedOrder',
    label: _t('dosDaxryqMM1SAhnST2yrs'),
    content: {
      introduce: _t('4f78621c6c5d4000abf6'), // 类型介绍
      sideIllustration: {
        // 区分买卖
        // 图例 （buy | sell）
        buy: {
          description: (
            <>
              <DescriptionContent>{_t('aac5eae2b64f4000a3ab')}</DescriptionContent>
              <DescriptionTitle>{_t('3Vxdu1Xchn2NhqKtXcA5kR')}</DescriptionTitle>
              <DescriptionContent>{_t('5rd2iUyH38YkL7f1xEzoa9')}</DescriptionContent>
              <DescriptionTitle>{_t('rSix336ZRsxAVJ1YWYexUs')}</DescriptionTitle>
              <DescriptionContent>{_t('rrBJ5sNe8eaVLSZkqC13gD')}</DescriptionContent>
              <DescriptionTitle>{_t('sX1rfDBFez5jhKAvJiWicf')}</DescriptionTitle>
              <DescriptionContent>{_t('68D1j8tGihqNgqoukGHXw3')}</DescriptionContent>
            </>
          ),
          img: isSm ? TwapBuyH5 : TwapBuy,
          timeWeightedImgItems: [
            // 图例
            {
              itemIcon: <TimeWeightedLine />,
              itemTitle: _t('de06653cdd3f4000a26a'),
            },
            {
              itemIcon: <TimeWeightedCircleFilled className="primary" />,
              itemTitle: _t('98aee4799c504000a616'),
            },
            {
              itemIcon: <TimeWeightedCircleFilled className="icon" />,
              itemTitle: _t('b90a0cab8f0e4000a5fb'),
            },
            {
              itemIcon: <TimeWeightedAreaGradient className="primary" />,
              itemTitle: _t('ab101e37e06c4000afd8'),
            },
            {
              itemIcon: <TimeWeightedAreaGradient className="full-grey" />,
              itemTitle: _t('0f54e872e89b4000abdc'),
            },
          ],
        },
        sell: {
          description: (
            <>
              <DescriptionContent>{_t('2c5bb8cead314000a69e')}</DescriptionContent>
              <DescriptionTitle>{_t('3Vxdu1Xchn2NhqKtXcA5kR')}</DescriptionTitle>
              <DescriptionContent>{_t('5rd2iUyH38YkL7f1xEzoa9')}</DescriptionContent>
              <DescriptionTitle>{_t('rSix336ZRsxAVJ1YWYexUs')}</DescriptionTitle>
              <DescriptionContent>{_t('rrBJ5sNe8eaVLSZkqC13gD')}</DescriptionContent>
              <DescriptionTitle>{_t('sX1rfDBFez5jhKAvJiWicf')}</DescriptionTitle>
              <DescriptionContent>{_t('68D1j8tGihqNgqoukGHXw3')}</DescriptionContent>
            </>
          ),
          img: isSm ? TwapSellH5 : TwapSell,
          timeWeightedImgItems: [
            // 图例
            {
              itemIcon: <TimeWeightedLine />,
              itemTitle: _t('de06653cdd3f4000a26a'),
            },
            {
              itemIcon: <TimeWeightedCircleFilled className="primary" />,
              itemTitle: _t('3ca18eb092e04000a383'),
            },
            {
              itemIcon: <TimeWeightedCircleFilled className="icon" />,
              itemTitle: _t('b90a0cab8f0e4000a5fb'),
            },
            {
              itemIcon: <TimeWeightedAreaGradient className="primary" />,
              itemTitle: _t('ab101e37e06c4000afd8'),
            },
            {
              itemIcon: <TimeWeightedAreaGradient className="full-grey" />,
              itemTitle: _t('0f54e872e89b4000abdc'),
            },
          ],
        },
      },
    },
  },
];
